import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import cardsData from '../data/cards.json';
import BuyerReport from '../components/BuyerReport.jsx';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient.js';

const STATUS_LABELS = {
  loading: '리포트를 불러오는 중입니다.',
  unconfigured: 'Supabase 설정이 필요합니다.',
  notfound: '공유 링크를 찾을 수 없습니다.',
  error: '리포트를 불러오지 못했습니다.'
};

export default function Share() {
  const { token } = useParams();
  const navigate = useNavigate();
  const cardsById = useMemo(() => new Map(cardsData.map((card) => [card.id, card])), []);
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setStatus('unconfigured');
      return;
    }
    if (!token) {
      setStatus('notfound');
      return;
    }
    let isMounted = true;
    const load = async () => {
    const { data, error } = await supabase
        .from('tarot_reports')
        .select('*')
        .eq('share_token', token)
        .maybeSingle();
      if (!isMounted) {
        return;
      }
      if (error) {
        console.error('[supabase] failed to load shared report', error);
        setStatus('error');
        return;
      }
      if (!data) {
        setStatus('notfound');
        return;
      }
      setReport(data);
      setStatus('ready');
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, [token]);

  if (status !== 'ready') {
    return (
      <div className="page buyer">
        <header className="top-bar">
          <div>
            <p className="eyebrow">SHARED REPORT</p>
            <h1>공유된 리포트</h1>
            <p className="subtitle">{STATUS_LABELS[status] ?? STATUS_LABELS.error}</p>
          </div>
          <div className="top-actions">
            <button className="btn ghost" type="button" onClick={() => navigate('/')}>홈으로</button>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="page buyer">
      <header className="top-bar">
        <div>
          <p className="eyebrow">SHARED REPORT</p>
          <h1>타로 리포트 확인</h1>
          <p className="subtitle">공유받은 리포트를 확인하세요.</p>
        </div>
        <div className="top-actions">
          <button className="btn ghost" type="button" onClick={() => navigate('/')}>홈으로</button>
        </div>
      </header>

      <BuyerReport report={report} cardsById={cardsById} onReset={() => navigate('/')} />
    </div>
  );
}
