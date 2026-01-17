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
  const [savedReports, setSavedReports] = useState([]); // 저장된 리포트 이력
  const saveTimers = useRef(new Map());
  const offlineQueue = useRef(new Map()); // 오프라인 시 저장 대기 큐
  const reportsRef = useRef(reports); // 최신 reports 상태를 추적하기 위한 ref

  // reports가 변경될 때마다 ref도 업데이트
  useEffect(() => {
    reportsRef.current = reports;
  }, [reports]);

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
      setTimeout(() => setSaveStatus('idle'), 3000);
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
      // saved 상태를 3초 유지
      setTimeout(() => setSaveStatus('idle'), 3000);
      
      // 저장 이력에 추가
      setSavedReports((prev) => {
        const filtered = prev.filter((r) => r.id !== report.id);
        return [
          {
            id: report.id,
            customer_name: report.customer_name,
            updated_at: new Date().toISOString(),
            status: report.status
          },
          ...filtered
        ];
      });
      
      console.log('[supabase] report saved successfully', report.id);
    } catch (err) {
      console.error('[supabase] report upsert failed', err);
      setSaveStatus('error');
      
      // 오프라인 또는 네트워크 오류 시 큐에 저장
      if (!isOnline) {
        offlineQueue.current.set(report.id, report);
      }

      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [user, isOnline]);

  const queueSave = useCallback((report) => {
    // ⚠️ 자동 저장 비활성화
    // 명시적 저장 버튼만 사용
    // 필요시 이 함수를 통해 저장
    
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

  const ensureShareToken = useCallback(async (id, forceNew = false) => {
    if (!supabase || !user) {
      console.error('[ensureShareToken] supabase or user not available');
      return null;
    }
    // ref를 사용하여 항상 최신 리포트 상태를 가져옴
    const current = reportsRef.current.find((report) => report.id === id);
    if (!current) {
      console.error('[ensureShareToken] report not found', id);
      return null;
    }
    // forceNew가 false이고 이미 share_token이 있으면 기존 토큰 반환
    if (!forceNew && current.share_token) {
      return current.share_token;
    }
    // 새 토큰 생성
    const token = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    // 전체 링크 URL 생성
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/share/${token}`
      : null;
    // share_token과 share_url을 함께 저장
    const next = { ...current, share_token: token, share_url: shareUrl };
    console.log('[ensureShareToken] generating new token', { id, token, shareUrl, report: next });
    setReports((prev) =>
      prev.map((report) => (report.id === id ? next : report))
    );
    // reportsRef도 즉시 업데이트
    reportsRef.current = reportsRef.current.map((report) => (report.id === id ? next : report));
    // Supabase에 저장
    await upsertReport(next);
    console.log('[ensureShareToken] token and URL saved to supabase', { id, token, shareUrl });
    return token;
  }, [setReports, upsertReport, supabase, user]);

  // 명시적 저장 함수 (저장 버튼 클릭 시)
  const saveReportNow = useCallback(async (id) => {
    const report = reports.find((r) => r.id === id);
    if (!report) {
      return;
    }
    await upsertReport(report);
  }, [reports, upsertReport]);

  // 새 리포트 생성 함수
  const createNewReport = useCallback(async () => {
    if (!supabase || !user) {
      console.error('[createNewReport] supabase or user not available');
      return null;
    }

    // 고유 ID 생성 (타임스탬프 기반)
    const newId = `report_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식

    // 새 리포트 기본 구조
    const newReport = {
      id: newId,
      customer_name: '',
      request_date: todayDate,
      question: '',
      status: 'pending',
      spread_name: '과거/현재/미래',
      cards: [],
      overall_advice: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 로컬 상태에 추가
    setReports((prev) => {
      const updated = [newReport, ...prev];
      reportsRef.current = updated;
      return updated;
    });

    // 활성 리포트로 설정
    setActiveReportId(newId);

    // Supabase에 저장
    try {
      await upsertReport(newReport);
      console.log('[createNewReport] new report created', newId);
      return newId;
    } catch (error) {
      console.error('[createNewReport] failed to save new report', error);
      // 에러가 발생해도 로컬 상태는 유지 (오프라인 모드 지원)
      return newId;
    }
  }, [supabase, user, upsertReport, setReports, setActiveReportId]);

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
    isOnline,
    saveReportNow,
    savedReports,
    createNewReport
  }), [activeReportId, ensureShareToken, replaceReports, reports, setActiveReportId, updateReport, saveStatus, isOnline, saveReportNow, savedReports, createNewReport]);

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
}

export function useReportContext() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReportContext must be used within ReportProvider');
  }
  return context;
}
