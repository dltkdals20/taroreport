const fallbackSrc =
  'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"240\" height=\"360\"><rect width=\"100%\" height=\"100%\" fill=\"%23131b2a\"/><text x=\"50%\" y=\"50%\" fill=\"%23aab3c2\" font-size=\"20\" font-family=\"sans-serif\" text-anchor=\"middle\" dominant-baseline=\"middle\">Tarot</text></svg>';

export default function CardEditorItem({
  entry,
  index,
  card,
  datalistId,
  dragProps,
  onUpdate,
  onRemove,
  onSelectCard,
  onFocusField
}) {
  // entry.id가 없으면 생성 (새로운 entry의 경우)
  const entryId = entry.id || `card_entry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  // id가 없으면 업데이트
  if (!entry.id) {
    onUpdate({ id: entryId });
  }

  const directionLabel = entry.direction === 'reversed' ? '역방향 ▼' : '정방향 ▲';

  return (
    <div className="editor-card" {...dragProps}>
      <div className="editor-card-header">
        <div className="drag-handle" title="드래그하여 순서 변경">⋮⋮</div>
        <div>
          <p className="card-index">카드 {index + 1}</p>
          <p className="card-subtitle">위치 의미와 해석을 작성하세요</p>
        </div>
        <button className="icon-btn danger" type="button" onClick={onRemove}>삭제</button>
      </div>

      <div className="editor-card-body">
        <label className="field">
          <span>위치 의미</span>
          <input
            list={datalistId}
            value={entry.position}
            onChange={(event) => onUpdate({ position: event.target.value })}
            placeholder="예: 과거, 현재, 미래"
          />
        </label>

        <div className="card-visual">
          <div className={`card-preview ${card ? '' : 'empty'}`}>
            {card ? (
              <img
                src={card.image_url}
                alt={card.name_kr}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = fallbackSrc;
                }}
              />
            ) : (
              <div className="placeholder">카드를 선택하세요</div>
            )}
          </div>
          <div>
            <p className="card-title">{card ? card.name_kr : '미선택'}</p>
            <p className="card-title-en">{card ? card.name_en : 'No card selected'}</p>
            <div className="card-actions">
              <button className="btn ghost" type="button" onClick={onSelectCard}>카드 선택</button>
              <button
                className={`btn ${entry.direction === 'reversed' ? 'danger' : 'ghost'}`}
                type="button"
                onClick={() =>
                  onUpdate({ direction: entry.direction === 'reversed' ? 'upright' : 'reversed' })
                }
              >
                {directionLabel}
              </button>
            </div>
          </div>
        </div>

        <label className="field">
          <span>해석</span>
          <textarea
            value={entry.interpretation}
            onChange={(event) => onUpdate({ interpretation: event.target.value })}
            onFocus={() => onFocusField({ type: 'card', index })}
            placeholder="해석 내용을 입력하세요"
          />
        </label>
      </div>
    </div>
  );
}
