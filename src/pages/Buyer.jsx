import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import cardsData from '../data/cards.json';
import { useReportContext } from '../contexts/ReportContext.jsx';
import BuyerReport from '../components/BuyerReport.jsx';
import { getTodayDateString } from '../utils/date.js';

export default function Buyer() {
  const navigate = useNavigate();
  const { reports, activeReportId, setActiveReportId, ensureShareToken, isSupabaseConfigured } = useReportContext();
  const cardsById = useMemo(() => new Map(cardsData.map((card) => [card.id, card])), []);
  const activeReport = reports.find((report) => report.id === activeReportId) || reports[0];
  const todayDate = getTodayDateString();

  const handleShare = async (report) => {
    if (!report) {
      return window.location.href;
    }
    if (!isSupabaseConfigured) {
      return window.location.href;
    }
    const token = await ensureShareToken(report.id);
    if (!token) {
      return window.location.href;
    }
    return `${window.location.origin}/share/${token}`;
  };

  return (
    <div className="page buyer">
      <header className="top-bar">
        <div>
          <p className="eyebrow">BUYER VIEW</p>
          <h1>결쌤 타로 리포트</h1>
          <p className="subtitle">카드를 뒤집고 해석을 확인해보세요.</p>
        </div>
        <div className="top-actions">
          <select
            value={activeReport?.id ?? ''}
            onChange={(event) => setActiveReportId(event.target.value)}
          >
            {reports.map((report) => (
              <option key={report.id} value={report.id}>
                {report.customer_name} · {todayDate}
              </option>
            ))}
          </select>
          <button className="btn ghost" type="button" onClick={() => navigate('/')}>홈으로</button>
        </div>
      </header>

      <BuyerReport
        report={activeReport}
        cardsById={cardsById}
        positionTop
        onShare={handleShare}
        onReset={() => navigate('/')}
      />
    </div>
  );
}
