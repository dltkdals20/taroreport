import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import initialReports from '../data/reports.json';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient.js';
import { useAuth } from './AuthContext.jsx';

const ReportContext = createContext(null);

export function ReportProvider({ children }) {
  const { user } = useAuth();
  const [reports, setReports] = useLocalStorage('tarotReports', initialReports);
  const [activeReportId, setActiveReportId] = useLocalStorage(
    'tarotActiveReportId',
    initialReports[0]?.id ?? null
  );
  const saveTimers = useRef(new Map());

  const upsertReport = useCallback(async (report) => {
    if (!supabase || !user) {
      return;
    }
    const payload = {
      ...report,
      user_id: user.id,
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from('tarot_reports').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error('[supabase] report upsert failed', error);
    }
  }, [user]);

  const queueSave = useCallback((report) => {
    if (!supabase || !user) {
      return;
    }
    const existing = saveTimers.current.get(report.id);
    if (existing) {
      clearTimeout(existing);
    }
    const timeout = setTimeout(() => {
      saveTimers.current.delete(report.id);
      void upsertReport(report);
    }, 400);
    saveTimers.current.set(report.id, timeout);
  }, [upsertReport, user]);

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
    isSupabaseConfigured
  }), [activeReportId, ensureShareToken, replaceReports, reports, setActiveReportId, updateReport]);

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
}

export function useReportContext() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReportContext must be used within ReportProvider');
  }
  return context;
}
