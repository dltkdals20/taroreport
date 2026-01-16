import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cardsData from '../data/cards.json';
import { useReportContext } from '../contexts/ReportContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import CardAddModal from '../components/CardAddModal.jsx';
import CardEditorItem from '../components/CardEditorItem.jsx';
import TemplateBar from '../components/TemplateBar.jsx';
import SnippetBar from '../components/SnippetBar.jsx';
import BuyerReport from '../components/BuyerReport.jsx';
import { getTodayDateString } from '../utils/date.js';

const POSITION_SUGGESTIONS = [
  '과거',
  '현재',
  '미래',
  '나',
  '상대',
  '관계',
  '상황',
  '장애물',
  '조언',
  '가능성',
  '감정',
  '의도'
];

const DEFAULT_TEMPLATES = [
  { name: '과거/현재/미래', positions: ['과거', '현재', '미래'] },
  { name: '나/상대/관계', positions: ['나', '상대', '관계'] },
  { name: '상황/장애물/조언', positions: ['상황', '장애물', '조언'] },
  { name: '현재/숨은감정/행동', positions: ['현재', '숨은감정', '행동'] }
];

export default function Reader() {
  const navigate = useNavigate();
  const {
    reports,
    activeReportId,
    setActiveReportId,
    updateReport,
    ensureShareToken,
    isSupabaseConfigured,
    saveStatus,
    isOnline,
    saveReportNow,
    savedReports
  } = useReportContext();
  const { signOut } = useAuth();
  const [statusFilter, setStatusFilter] = useState('pending');
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalTargetIndex, setModalTargetIndex] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [savedListOpen, setSavedListOpen] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [toast, setToast] = useState('');
  const [dragIndex, setDragIndex] = useState(null);
  const [shareLink, setShareLink] = useState('');

  const [templates, setTemplates] = useLocalStorage('tarotTemplates', DEFAULT_TEMPLATES);
  const [snippets, setSnippets] = useLocalStorage('tarotSnippets', []);

  const cardsById = useMemo(() => new Map(cardsData.map((card) => [card.id, card])), []);
  const todayDate = getTodayDateString();

  const filteredReports = reports.filter((report) => report.status === statusFilter);
  const activeReport = reports.find((report) => report.id === activeReportId) || reports[0];

  useEffect(() => {
    if (!activeReport?.share_token) {
      setShareLink('');
      return;
    }
    if (typeof window === 'undefined') {
      setShareLink('');
      return;
    }
    setShareLink(`${window.location.origin}/share/${activeReport.share_token}`);
  }, [activeReport?.id, activeReport?.share_token]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2000);
  };

  const handleSelectReport = (id) => {
    setActiveReportId(id);
  };

  const updateCardEntry = (index, patch) => {
    if (!activeReport) return;
    updateReport(activeReport.id, (report) => {
      const nextCards = report.cards.map((card, cardIndex) =>
        cardIndex === index ? { ...card, ...patch } : card
      );
      return { ...report, cards: nextCards };
    });
  };

  const addCardEntry = (cardId, direction) => {
    if (!activeReport) return;
    updateReport(activeReport.id, (report) => {
      const entry = {
        id: `card_entry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        card_id: cardId,
        position: '',
        direction,
        interpretation: ''
      };
      const nextCards = [...report.cards];
      if (modalTargetIndex !== null) {
        const target = nextCards[modalTargetIndex] || entry;
        // ✅ interpretation과 position을 명시적으로 보존
        nextCards[modalTargetIndex] = {
          ...target,
          id: target.id || entry.id,
          card_id: cardId,
          direction,
          position: target.position || '', // 기존 위치 의미 유지
          interpretation: target.interpretation || '' // 기존 해석 유지
        };
      } else {
        nextCards.push(entry);
      }
      return { ...report, cards: nextCards };
    });
    setModalOpen(false);
    setModalTargetIndex(null);
  };

  const removeCardEntry = (index) => {
    if (!activeReport) return;
    updateReport(activeReport.id, (report) => {
      const nextCards = report.cards.filter((_, cardIndex) => cardIndex !== index);
      return { ...report, cards: nextCards };
    });
  };

  const handleDragStart = (event, index) => {
    setDragIndex(index);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, index) => {
    event.preventDefault();
    if (dragIndex === null || dragIndex === index || !activeReport) {
      return;
    }
    updateReport(activeReport.id, (report) => {
      const nextCards = [...report.cards];
      const [moved] = nextCards.splice(dragIndex, 1);
      nextCards.splice(index, 0, moved);
      return { ...report, cards: nextCards };
    });
    setDragIndex(null);
  };

  const applyPositions = (positions, spreadName) => {
    if (!activeReport || positions.length === 0) {
      return;
    }
    updateReport(activeReport.id, (report) => {
      const mapped = positions.map((position, index) => {
        const existing = report.cards[index] || {
          card_id: null,
          position: '',
          direction: 'upright',
          interpretation: ''
        };
        return { ...existing, position };
      });
      const extras = report.cards.slice(positions.length);
      return { ...report, spread_name: spreadName, cards: [...mapped, ...extras] };
    });
  };

  const handleApplyTemplate = (name) => {
    if (!activeReport) return;
    const template = templates.find((item) => item.name === name);
    if (!template) return;
    applyPositions(template.positions, template.name);
    showToast('스프레드를 적용했습니다.');
  };

  const handleApplyCustomTemplate = () => {
    if (!activeReport) return;
    const input = window.prompt('포지션을 쉼표로 구분해 입력해 주세요\\n예: 과거,현재,미래');
    if (!input) return;
    const positions = input
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    if (positions.length === 0) return;
    applyPositions(positions, '사용자 지정');
    showToast('사용자 지정 스프레드를 적용했습니다.');
  };

  const handleSaveTemplate = () => {
    if (!activeReport) return;
    const positions = activeReport.cards.map((card) => card.position).filter(Boolean);
    const name = window.prompt('템플릿 이름을 입력해 주세요');
    if (!name || positions.length === 0) return;
    setTemplates((prev) => [...prev, { name, positions }]);
    showToast('템플릿을 저장했습니다.');
  };

  const handleInsertSnippet = (snippet) => {
    if (!activeReport || !activeField) return;
    if (activeField.type === 'card') {
      updateReport(activeReport.id, (report) => {
        const nextCards = report.cards.map((card, index) => {
          if (index !== activeField.index) return card;
          const nextText = card.interpretation
            ? `${card.interpretation}\n${snippet}`
            : snippet;
          return { ...card, interpretation: nextText };
        });
        return { ...report, cards: nextCards };
      });
    }
    if (activeField.type === 'advice') {
      updateReport(activeReport.id, (report) => {
        const nextText = report.overall_advice
          ? `${report.overall_advice}\n${snippet}`
          : snippet;
        return { ...report, overall_advice: nextText };
      });
    }
  };

  const handleSave = async () => {
    if (!activeReport) return;
    
    try {
      // 명시적 저장 - 저장 버튼 클릭 시에만
      await saveReportNow(activeReport.id);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleGenerateLink = async () => {
    if (!activeReport) return;
    if (!isSupabaseConfigured) {
      showToast('Supabase 설정이 필요합니다.');
      return;
    }
    updateReport(activeReport.id, { status: 'completed' });
    setStatusFilter('completed');
    const token = await ensureShareToken(activeReport.id);
    if (!token) {
      showToast('링크 생성에 실패했습니다.');
      return;
    }
    if (typeof window !== 'undefined') {
      setShareLink(`${window.location.origin}/share/${token}`);
    }
    showToast('링크 생성 완료');
  };

  const handleCopyLink = async () => {
    if (!shareLink) {
      return;
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareLink);
        showToast('링크 복사 완료');
        return;
      }
      window.prompt('링크를 복사하세요', shareLink);
    } catch (error) {
      showToast('링크 복사에 실패했습니다.');
    }
  };

  return (
    <div className="page reader">
      <header className="top-bar">
        <div>
          <p className="eyebrow">READER CONSOLE</p>
          <h1>타로 리딩 해석 작성</h1>
          <p className="subtitle">대기 중인 상담을 선택하고 해석을 작성하세요.</p>
        </div>
        <div className="top-actions">
          <button className="btn ghost" type="button" onClick={() => navigate('/')}>홈으로</button>
          <button className="btn ghost" type="button" onClick={() => setSavedListOpen(true)}>📋 저장 목록 ({savedReports.length})</button>
          <button className="btn ghost" type="button" onClick={() => setPreviewOpen(true)}>미리보기</button>
          <button className="btn ghost" type="button" onClick={() => signOut()}>로그아웃</button>
        </div>
      </header>

      <div className="reader-grid">
        <section className="panel report-list">
          <div className="panel-header">
            <h2>상담 목록</h2>
            <div className="pill-row">
              <button
                type="button"
                className={`pill ${statusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setStatusFilter('pending')}
              >
                대기 중
              </button>
              <button
                type="button"
                className={`pill ${statusFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setStatusFilter('completed')}
              >
                완료됨
              </button>
            </div>
          </div>
          <div className="list">
            {filteredReports.length === 0 ? (
              <p className="empty-state">해당 상태의 상담이 없습니다.</p>
            ) : (
              filteredReports.map((report) => (
                <button
                  type="button"
                  className={`list-item ${report.id === activeReport?.id ? 'active' : ''}`}
                  key={report.id}
                  onClick={() => handleSelectReport(report.id)}
                >
                  <div>
                    <p className="list-title">{report.customer_name}</p>
                    <p className="list-meta">{todayDate}</p>
                    <p className="list-question">{report.question}</p>
                  </div>
                  <span className={`status ${report.status}`}>{report.status === 'pending' ? '대기' : '완료'}</span>
                </button>
              ))
            )}
          </div>
        </section>

        <section className="panel editor">
          {!activeReport ? (
            <p className="empty-state">선택된 상담이 없습니다.</p>
          ) : (
            <>
              <div className="editor-header">
                <div className="editor-meta">
                  <p className="eyebrow">REPORT</p>
                  <label className="field editor-name">
                    <span>고객 이름</span>
                    <input
                      type="text"
                      value={activeReport.customer_name ?? ''}
                      onChange={(event) => updateReport(activeReport.id, { customer_name: event.target.value })}
                      placeholder="고객 이름을 입력하세요"
                    />
                  </label>
                  <p className="muted">요청일 {todayDate}</p>
                </div>
                <div className="editor-status">
                  <span className={`status ${activeReport.status}`}>
                    {activeReport.status === 'pending' ? '대기' : '완료'}
                  </span>
                </div>
              </div>
              <div className="question-box">
                <p className="label">고객 질문</p>
                <textarea
                  value={activeReport.question ?? ''}
                  onChange={(event) => updateReport(activeReport.id, { question: event.target.value })}
                  placeholder="고객 질문을 입력하세요"
                />
              </div>

              <TemplateBar
                templates={templates}
                onApply={handleApplyTemplate}
                onApplyCustom={handleApplyCustomTemplate}
                onSave={handleSaveTemplate}
              />

              <datalist id="position-list">
                {POSITION_SUGGESTIONS.map((item) => (
                  <option value={item} key={item} />
                ))}
              </datalist>

              <div className="editor-cards">
                {activeReport.cards.map((entry, index) => (
                  <CardEditorItem
                    key={entry.id || `temp_${index}`}
                    entry={entry}
                    index={index}
                    card={cardsById.get(entry.card_id)}
                    datalistId="position-list"
                    onUpdate={(patch) => updateCardEntry(index, patch)}
                    onRemove={() => removeCardEntry(index)}
                    onSelectCard={() => {
                      setModalTargetIndex(index);
                      setModalOpen(true);
                    }}
                    onFocusField={(field) => setActiveField(field)}
                    dragProps={{
                      draggable: true,
                      onDragStart: (event) => handleDragStart(event, index),
                      onDragOver: handleDragOver,
                      onDrop: (event) => handleDrop(event, index)
                    }}
                  />
                ))}
              </div>

              <button
                className="btn ghost"
                type="button"
                onClick={() => {
                  setModalTargetIndex(null);
                  setModalOpen(true);
                }}
              >
                + 카드 추가
              </button>

              <label className="field">
                <span>종합 조언 (선택)</span>
                <textarea
                  value={activeReport.overall_advice}
                  onChange={(event) => updateReport(activeReport.id, { overall_advice: event.target.value })}
                  onFocus={() => setActiveField({ type: 'advice' })}
                  placeholder="전체적인 조언을 입력하세요"
                />
              </label>

              <SnippetBar
                snippets={snippets}
                onAdd={(snippet) => setSnippets((prev) => [...prev, snippet])}
                onInsert={handleInsertSnippet}
                onRemove={(index) =>
                  setSnippets((prev) => prev.filter((_, snippetIndex) => snippetIndex !== index))
                }
              />

              <div className="editor-actions">
                <button className="btn ghost" type="button" onClick={handleSave}>
                  {saveStatus === 'saving' ? '💾 저장 중...' : '✅ 저장'}
                </button>
                <button className="btn ghost" type="button" onClick={() => setPreviewOpen(true)}>
                  미리보기
                </button>
                <button className="btn primary" type="button" onClick={handleGenerateLink}>
                  {isOnline ? '링크 생성' : '오프라인 (연결 대기)'}
                </button>
              </div>

              {/* 저장 상태 표시 */}
              {saveStatus === 'saving' && (
                <div className="save-status saving">
                  <span>💾 저장 중...</span>
                </div>
              )}
              {saveStatus === 'saved' && (
                <div className="save-status saved">
                  <span>✅ 저장됨</span>
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="save-status error">
                  <span>❌ {isOnline ? '저장 실패' : '오프라인 (연결 후 저장 가능)'}</span>
                </div>
              )}

              {shareLink && (
                <div className="share-link">
                  <input type="text" value={shareLink} readOnly />
                  <button className="btn ghost" type="button" onClick={handleCopyLink}>복사</button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <CardAddModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addCardEntry}
        cards={cardsData}
      />

      {previewOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setPreviewOpen(false)}>
          <div
            className="modal preview"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="modal-header">
              <h2>구매자 미리보기</h2>
              <button className="icon-btn" onClick={() => setPreviewOpen(false)} aria-label="닫기">✕</button>
            </header>
            <BuyerReport report={activeReport} cardsById={cardsById} autoReveal positionTop onReset={() => {}} />
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}

      {/* 저장 목록 모달 */}
      {savedListOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSavedListOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
            style={{ maxWidth: '600px' }}
          >
            <header className="modal-header">
              <h2>📋 저장 목록</h2>
              <button className="icon-btn" onClick={() => setSavedListOpen(false)} aria-label="닫기">✕</button>
            </header>

            <div style={{ padding: '16px 20px 20px', overflowY: 'auto', maxHeight: '70vh' }}>
              {savedReports.length === 0 ? (
                <p style={{ color: 'var(--text-2)', textAlign: 'center' }}>저장된 리포트가 없습니다.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {savedReports.map((report) => (
                    <button
                      key={report.id}
                      type="button"
                      onClick={() => {
                        handleSelectReport(report.id);
                        setSavedListOpen(false);
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--stroke)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px 16px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = 'rgba(246, 195, 86, 0.5)';
                        e.target.style.boxShadow = '0 0 0 1px rgba(246, 195, 86, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = 'var(--stroke)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '700', marginBottom: '4px' }}>
                          {report.customer_name}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '4px' }}>
                          {new Date(report.updated_at).toLocaleString('ko-KR')}
                        </p>
                        <span
                          className={`status ${report.status}`}
                          style={{ fontSize: '11px' }}
                        >
                          {report.status === 'pending' ? '대기' : report.status === 'completed' ? '완료' : '임시'}
                        </span>
                      </div>
                      <div style={{ fontSize: '20px' }}>✅</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
