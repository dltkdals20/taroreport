import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import initialReports from '../data/reports.json';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient.js';
import { useAuth } from './AuthContext.jsx';

const ReportContext = createContext(null);

// 진실의 원천: Supabase
export function ReportProvider({ children }) {
  const { user } = useAuth();
  const [reports, setReports] = useState(initialReports);
  const [activeReportId, setActiveReportId] = useState(initialReports[0]?.id ?? null);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const saveTimers = useRef(new Map());
  const offlineQueue = useRef(new Map()); // 오프라인 시 저장 대기 큐

  // 온라인/오프라인 상태 감지
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const upsertReport = useCallback(async (report) => {
    if (!supabase || !user) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
      return;
    }

    try {
      setSaveStatus('saving');

      const payload = {
        ...report,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('tarot_reports')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        throw error;
      }

      // 성공 시 오프라인 큐에서 제거
      offlineQueue.current.delete(report.id);

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('[supabase] report upsert failed', err);
      setSaveStatus('error');
      
      // 오프라인 또는 네트워크 오류 시 큐에 저장
      if (!isOnline) {
        offlineQueue.current.set(report.id, report);
      }

      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  }, [user, isOnline]);

  const queueSave = useCallback((report) => {
    if (!supabase || !user) {
      return;
    }

    const existing = saveTimers.current.get(report.id);
    if (existing) {
      clearTimeout(existing);
    }

    // 온라인 상태면 Supabase 저장, 오프라인이면 큐에 저장만
    const timeout = setTimeout(() => {
      saveTimers.current.delete(report.id);
      if (isOnline) {
        void upsertReport(report);
      } else {
        offlineQueue.current.set(report.id, report);
        setSaveStatus('error'); // "오프라인" 상태 표시
      }
    }, 300); // 디바운싱 300ms

    saveTimers.current.set(report.id, timeout);
  }, [upsertReport, user, isOnline]);

  const updateReport = useCallback((id, updater) => {
    let updatedReport = null;
    setReports((prev) =>
      prev.map((report) => {
        if (report.id !== id) {
          return report;
        }
        const next = typeof updater === 'function' ? updater(report) : { ...report, ...updater };
        updatedReport = next;
        return next;
      })
    );
    if (updatedReport) {
      queueSave(updatedReport);
    }
  }, [queueSave, setReports]);

  const replaceReports = useCallback((nextReports) => {
    setReports(nextReports);
    if (nextReports.length > 0) {
      setActiveReportId((prevId) =>
        nextReports.find((item) => item.id === prevId) ? prevId : nextReports[0].id
      );
    }
  }, [setActiveReportId, setReports]);

  const ensureShareToken = useCallback(async (id) => {
    if (!supabase || !user) {
      return null;
    }
    const current = reports.find((report) => report.id === id);
    if (!current) {
      return null;
    }
    if (current.share_token) {
      return current.share_token;
    }
    const token = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const next = { ...current, share_token: token };
    setReports((prev) =>
      prev.map((report) => (report.id === id ? next : report))
    );
    await upsertReport(next);
    return token;
  }, [reports, setReports, upsertReport]);

  // 온라인 복귀 시 오프라인 큐 재시도
  useEffect(() => {
    if (!isOnline || offlineQueue.current.size === 0) {
      return;
    }

    const retryOfflineReports = async () => {
      for (const [reportId, report] of offlineQueue.current.entries()) {
        await upsertReport(report);
      }
    };

    void retryOfflineReports();
  }, [isOnline, upsertReport]);

  useEffect(() => {
    if (!supabase || !user) {
      return;
    }
    let isMounted = true;
    const loadReports = async () => {
      const { data, error } = await supabase
        .from('tarot_reports')
        .select('*')
        .order('request_date', { ascending: false });
      if (!isMounted) {
        return;
      }
      if (error) {
        console.error('[supabase] failed to load reports', error);
        return;
      }
      if (data && data.length > 0) {
        setReports(data);
        setActiveReportId((prevId) =>
          data.find((item) => item.id === prevId) ? prevId : data[0].id
        );
      }
    };
    void loadReports();
    return () => {
      isMounted = false;
    };
  }, [setActiveReportId, setReports, user]);

  const value = useMemo(() => ({
    reports,
    activeReportId,
    setActiveReportId,
    updateReport,
    replaceReports,
    ensureShareToken,
    isSupabaseConfigured,
    saveStatus,
    isOnline
  }), [activeReportId, ensureShareToken, replaceReports, reports, setActiveReportId, updateReport, saveStatus, isOnline]);

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
}

export function useReportContext() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReportContext must be used within ReportProvider');
  }
  return context;
}
