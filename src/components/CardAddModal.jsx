import { useEffect, useMemo, useState } from 'react';

const CATEGORY_LABELS = {
  all: '전체',
  major: '메이저 아르카나',
  wands: '완드',
  cups: '컵',
  swords: '소드',
  pentacles: '펜타클'
};

const fallbackSrc =
  'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"240\" height=\"360\"><rect width=\"100%\" height=\"100%\" fill=\"%23131b2a\"/><text x=\"50%\" y=\"50%\" fill=\"%23aab3c2\" font-size=\"20\" font-family=\"sans-serif\" text-anchor=\"middle\" dominant-baseline=\"middle\">Tarot</text></svg>';

export default function CardAddModal({ isOpen, onClose, onAdd, cards, initialDirection = 'upright' }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [direction, setDirection] = useState(initialDirection);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setCategory('all');
      setSelectedId(null);
      setDirection(initialDirection);
    }
  }, [isOpen, initialDirection]);

  const filteredCards = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return cards.filter((card) => {
      const matchesCategory = category === 'all' || card.category === category;
      const matchesQuery = !normalized
        || card.name_en.toLowerCase().includes(normalized)
        || card.name_kr.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [cards, category, query]);

  if (!isOpen) {
    return null;
  }

  const handleAdd = () => {
    if (selectedId === null) {
      return;
    }
    onAdd(selectedId, direction);
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <h2>카드 추가</h2>
          <button className="icon-btn" onClick={onClose} aria-label="닫기">✕</button>
        </header>

        <div className="modal-controls">
          <input
            type="search"
            placeholder="카드 이름 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="pill-row">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`pill ${category === key ? 'active' : ''}`}
                onClick={() => setCategory(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="direction-toggle">
            <button
              type="button"
              className={`pill ${direction === 'upright' ? 'active' : ''}`}
              onClick={() => setDirection('upright')}
            >
              정방향 ▲
            </button>
            <button
              type="button"
              className={`pill ${direction === 'reversed' ? 'active danger' : ''}`}
              onClick={() => setDirection('reversed')}
            >
              역방향 ▼
            </button>
          </div>
        </div>

        <div className="card-grid">
          {filteredCards.map((card) => (
            <button
              key={card.id}
              type="button"
              className={`card-option ${selectedId === card.id ? 'selected' : ''}`}
              onClick={() => setSelectedId(card.id)}
            >
              <div className="card-thumb">
                <img
                  src={card.image_url}
                  alt={card.name_kr}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = fallbackSrc;
                  }}
                />
              </div>
              <div className="card-meta">
                <p className="card-name-kr">{card.name_kr}</p>
                <p className="card-name-en">{card.name_en}</p>
              </div>
            </button>
          ))}
        </div>

        <footer className="modal-footer">
          <button className="btn ghost" onClick={onClose}>취소</button>
          <button className="btn primary" onClick={handleAdd} disabled={selectedId === null}>추가</button>
        </footer>
      </div>
    </div>
  );
}
