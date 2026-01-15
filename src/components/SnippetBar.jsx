import { useState } from 'react';

export default function SnippetBar({ snippets, onAdd, onInsert, onRemove }) {
  const [text, setText] = useState('');

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    onAdd(trimmed);
    setText('');
  };

  return (
    <div className="snippet-bar">
      <div>
        <p className="section-title">자주 쓰는 문구</p>
        <p className="section-subtitle">해석 작성 속도를 높이는 즐겨찾기 문구입니다.</p>
      </div>
      <div className="snippet-input">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="예: 감정을 솔직히 표현하면 도움이 됩니다"
        />
        <button className="btn ghost" type="button" onClick={handleAdd}>추가</button>
      </div>
      <div className="snippet-list">
        {snippets.length === 0 ? (
          <p className="empty-state">저장된 문구가 없습니다.</p>
        ) : (
          snippets.map((snippet, index) => (
            <div className="snippet-item" key={`${snippet}-${index}`}>
              <span>{snippet}</span>
              <div className="snippet-actions">
                <button className="btn ghost" type="button" onClick={() => onInsert(snippet)}>삽입</button>
                <button className="btn ghost danger" type="button" onClick={() => onRemove(index)}>삭제</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
