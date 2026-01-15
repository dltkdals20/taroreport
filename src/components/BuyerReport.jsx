import { useEffect, useMemo, useState } from 'react';

const fallbackCard = {
  name_kr: '알 수 없음',
  name_en: 'Unknown',
  image_url: ''
};

const fallbackSrc =
  'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"240\" height=\"360\"><rect width=\"100%\" height=\"100%\" fill=\"%23131b2a\"/><text x=\"50%\" y=\"50%\" fill=\"%23aab3c2\" font-size=\"20\" font-family=\"sans-serif\" text-anchor=\"middle\" dominant-baseline=\"middle\">Tarot</text></svg>';

export default function BuyerReport({
  report,
  cardsById,
  showHeader = true,
  autoReveal = true,
  positionTop = true,
  onShare,
  onReset
}) {
  const [flipped, setFlipped] = useState({});
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (!report) {
      setFlipped({});
      setExpanded({});
      return;
    }
    if (autoReveal) {
      const nextState = {};
      report.cards.forEach((_, index) => {
        nextState[index] = true;
      });
      setFlipped(nextState);
      setExpanded({});
      return;
    }
    setFlipped({});
    setExpanded({});
  }, [autoReveal, report?.id]);

  const layoutClass = useMemo(() => {
    if (!report) return 'layout-many';
    if (report.cards.length === 1) return 'layout-one';
    if (report.cards.length === 3) return 'layout-three';
    return 'layout-many';
  }, [report]);

  if (!report) {
    return (
      <div className="panel">
        <p className="empty-state">리포트를 선택해 주세요.</p>
      </div>
    );
  }

  const spreadInfo = report.spread_name || `${report.cards.length}장 스프레드`;

  const handleToggleAll = () => {
    const allFlipped = report.cards.every((_, index) => flipped[index]);
    const nextState = {};
    report.cards.forEach((_, index) => {
      nextState[index] = !allFlipped;
    });
    setFlipped(nextState);
  };

  const handleShare = async () => {
    try {
      const shareUrl = onShare ? await onShare(report) : window.location.href;
      const shareData = {
        title: '결쌤 타로 리포트',
        text: `${report.customer_name}님의 결쌤 타로 리포트입니다.`,
        url: shareUrl || window.location.href
      };
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        alert('링크를 복사했습니다.');
      }
    } catch (error) {
      alert('공유를 완료하지 못했습니다.');
    }
  };

  return (
    <div className="buyer-report">
      <div className="mystic-bg" aria-hidden="true" />
      {showHeader && (
        <header className="report-header">
          <div>
            <p className="eyebrow">REPORT</p>
            <h2>{report.customer_name}님의 상담 리포트</h2>
            <p className="muted">상담일 {report.request_date} · {spreadInfo}</p>
          </div>
          <div className="header-actions">
            <button className="btn ghost" type="button" onClick={handleToggleAll}>
              {report.cards.every((_, index) => flipped[index]) ? '모두 접기' : '모두 펼치기'}
            </button>
          </div>
        </header>
      )}

      {report.question && (
        <div className="question-box">
          <p className="label">고객 질문</p>
          <p>{report.question}</p>
        </div>
      )}

      <section className={`card-layout ${layoutClass}`}>
        {report.cards.map((entry, index) => {
          const card = cardsById.get(entry.card_id) || fallbackCard;
          const isFlipped = Boolean(flipped[index]);
          const isExpanded = Boolean(expanded[index]);
          const directionLabel = entry.direction === 'reversed' ? '역방향 ▼' : '정방향 ▲';
          const positionLabel = entry.position || '포지션';

          return (
            <article
              className="buyer-card"
              key={`${entry.card_id ?? 'none'}-${index}`}
            >
              {positionTop && (
                <div className="position-badge">
                  <span className="position highlight">🔮 {positionLabel}</span>
                </div>
              )}
              <div
                className={`flip-card ${isFlipped ? 'is-flipped' : ''}`}
                onClick={() => {
                  setFlipped((prev) => ({ ...prev, [index]: !prev[index] }));
                }}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-face back">
                    <div className="card-back">GYEOL</div>
                  </div>
                  <div className="flip-card-face front">
                    {card.image_url ? (
                      <img
                        src={card.image_url}
                        alt={card.name_kr}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = fallbackSrc;
                        }}
                      />
                    ) : (
                      <div className="card-front-fallback">카드 이미지</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="buyer-card-meta">
                {!positionTop && <span className="position">🔮 {positionLabel}</span>}
                <span className={`direction ${entry.direction === 'reversed' ? 'rev' : 'up'}`}>
                  {directionLabel}
                </span>
              </div>
              <p className="card-title">{card.name_kr}</p>
              <p className="card-title-en">{card.name_en}</p>

              <button
                className="btn primary"
                type="button"
                onClick={() => {
                  setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
                }}
                disabled={!isFlipped}
              >
                해석보기
              </button>

              <div className={`interpretation ${isExpanded ? 'open' : ''}`}>
                <p>{entry.interpretation || '해석이 아직 작성되지 않았습니다.'}</p>
              </div>
            </article>
          );
        })}
      </section>

      {report.overall_advice && (
        <section className="advice-box">
          <h3>종합 조언</h3>
          <p>{report.overall_advice}</p>
        </section>
      )}

      <div className="report-actions">
        <button className="btn ghost" type="button" onClick={handleShare}>공유하기</button>
        <button className="btn ghost" type="button" onClick={onReset}>처음으로</button>
      </div>
    </div>
  );
}
