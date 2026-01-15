import { useState } from 'react';

const CUSTOM_TEMPLATE = '사용자 지정';

export default function TemplateBar({ templates, onApply, onApplyCustom, onSave }) {
  const [selected, setSelected] = useState(templates[0]?.name ?? CUSTOM_TEMPLATE);

  const handleApply = () => {
    if (!selected) {
      return;
    }
    if (selected === CUSTOM_TEMPLATE) {
      onApplyCustom?.();
      return;
    }
    onApply(selected);
  };

  return (
    <div className="template-bar">
      <div>
        <p className="section-title">스프레드 템플릿</p>
        <p className="section-subtitle">자주 쓰는 포지션을 빠르게 적용하세요.</p>
      </div>
      <div className="template-controls">
        <select value={selected} onChange={(event) => setSelected(event.target.value)}>
          <option value={CUSTOM_TEMPLATE}>{CUSTOM_TEMPLATE}</option>
          {templates.map((template) => (
            <option key={template.name} value={template.name}>
              {template.name}
            </option>
          ))}
        </select>
        <button className="btn ghost" type="button" onClick={handleApply}>불러오기</button>
        <button className="btn ghost" type="button" onClick={onSave}>현재 스프레드 저장</button>
      </div>
    </div>
  );
}
