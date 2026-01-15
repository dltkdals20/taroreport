# 타로 해석 리포트 플랫폼 요구사항 정리

## 프로젝트 개요
- 타로 리더가 고객 카드 해석을 작성하고 전송
- 구매자는 카드 확인 → "눌러보기"로 해석 확인
- 모바일 최적화(웹앱 또는 반응형)

## 사용자 역할
- 타로 리더(해석 작성자): 상담 목록 확인, 해석 작성/전송
- 구매자(고객): 카드 뒤집기, 해석 확인, 공유

## 1. 타로 리더 페이지 (해석 작성)
### 1-1. 대기/완료 상담 목록
- 고객명, 요청일, 질문 내용 표시
- [해석 작성하기] 버튼으로 상세 이동
- 완료/대기 상태 구분

### 1-2. 해석 작성 화면
- 상단: 고객명, 요청일, 고객 질문
- 카드 영역(반복/가변)
  - 카드 N, 위치 의미 입력(자동완성)
  - 카드 이미지, 카드명, 정/역방향 표시
  - 해석 입력 텍스트 영역
  - [삭제] 버튼
  - 드래그앤드롭으로 카드 순서 변경
- 하단:
  - [+ 카드 추가]
  - 종합 조언 입력(선택)
  - [임시저장] [미리보기] [전송]

### 1-3. 카드 추가 모달
- 검색 기능
- 카테고리 분류: 메이저(22), 완드/컵/소드/펜타클(각 14)
- 카드 이미지 그리드
- 정방향/역방향 선택
- [취소] [추가]

### 1-4. 편의 기능
- 자주 쓰는 스프레드 템플릿 저장/불러오기
  - 예: 과거/현재/미래, 나/상대/관계, 상황/장애물/조언
- 위치 의미 자동완성(나, 과거, 현재, 미래, 상대방, 조언 등)
- 자주 쓰는 문구 저장(선택)

## 2. 구매자 페이지 (결과 확인)
### 2-1. 리포트 메인 화면
- 상단: 고객명 + 상담일, 스프레드 정보(예: 3장 스프레드)
- 카드 배치(카드 수에 따른 레이아웃)
  - 1장: 중앙, 3장: 가로, 5장+: 그리드/가로 스크롤
- 카드 위에 위치 의미 표시
- 초기 상태: 카드 뒷면
- 카드 클릭 시: 뒤집기 애니메이션 → 앞면 표시

### 2-2. 카드 상세(뒤집은 후)
- 카드 이미지(화면 60~70%, 중앙)
- 위치 의미 표시(예: 📍 과거)
- 카드명 + 정/역방향 뱃지
  - 정방향: 파랑/초록 [정방향 ▲]
  - 역방향: 빨강/보라 [역방향 ▼]
- [눌러보기 👇] 버튼

### 2-3. 해석 표시
- 타로 리더 해석 텍스트 표시
- 펼침 애니메이션(Accordion/Fade-in)

### 2-4. 종합 조언
- 해석 하단에 별도 강조 박스

### 2-5. 하단 버튼
- [공유하기] (카카오톡, 인스타 스토리 등)
- [처음으로]

## 3. 디자인/UX 요구사항
- 다크 모드 기본(검정/진한 보라/네이비 배경, 흰색 텍스트)
- 신비로운 타로 분위기
- 모바일 세로형 원페이지 최적화
- 애니메이션: 카드 뒤집기, 해석 펼침(Fade-in/Slide-down)
- 과하지 않게, 스킵 가능
- 이미지: WebP 포맷 권장(현재 메이저 아르카나는 Sacred Texts의 JPG 사용)

## 4. 데이터 구조 (JSON)
```json
{
  "cards": [
    {
      "id": 0,
      "name_en": "The Fool",
      "name_kr": "광대",
      "category": "major",
      "image_url": "https://www.sacred-texts.com/tarot/pkt/img/ar00.jpg"
    }
  ]
}
```

```json
{
  "report": {
    "id": "report_001",
    "customer_name": "김OO",
    "request_date": "2024-01-15",
    "question": "연애운이 궁금해요",
    "status": "pending | completed",
    "cards": [
      {
        "card_id": 0,
        "position": "과거",
        "direction": "upright",
        "interpretation": "해석 내용..."
      },
      {
        "card_id": 6,
        "position": "현재",
        "direction": "reversed",
        "interpretation": "해석 내용..."
      }
    ],
    "overall_advice": "종합 조언 내용..."
  }
}
```

## 5. 기술 스택(권장)
- Frontend: React 또는 Next.js
- 스타일: Tailwind CSS
- 애니메이션: Framer Motion
- 상태관리: Zustand 또는 React Context
- 데이터: JSON 파일 또는 Firebase/Supabase

## 6. 우선순위
1. 타로 리딩 해석 작성 기능
2. 구매자 결과 확인 페이지(슈퍼베이스 연결, 링크 전달)
3. 공유 기능

## 7. 구현 코드 (Vite + React)
### 프로젝트 구조
- package.json
- vite.config.js
- index.html
- src/main.jsx
- src/App.jsx
- src/styles.css
- src/contexts/ReportContext.jsx
- src/hooks/useLocalStorage.js
- src/data/cards.json
- src/data/reports.json
- src/pages/Home.jsx
- src/pages/Reader.jsx
- src/pages/Buyer.jsx
- src/components/CardAddModal.jsx
- src/components/CardEditorItem.jsx
- src/components/TemplateBar.jsx
- src/components/SnippetBar.jsx
- src/components/BuyerReport.jsx

### 실행 방법
```bash
npm install
npm run dev
```

### 이미지 준비
- `/public/images/tarot/*.webp` 경로에 실제 카드 이미지를 넣으면 자동으로 반영됩니다.
- 현재는 파일이 없을 경우를 대비해 SVG 기반의 기본 플레이스홀더를 사용합니다.
- 메이저 아르카나 샘플은 Sacred Texts의 Rider-Waite JPG를 직접 참조합니다.

### package.json
```json
{
  "name": "tarot-report",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.8"
  }
}
```

### vite.config.js
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
});
```

### index.html
```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tarot Report Studio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### src/main.jsx
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### src/App.jsx
```jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Reader from './pages/Reader.jsx';
import Buyer from './pages/Buyer.jsx';
import { ReportProvider } from './contexts/ReportContext.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <ReportProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reader" element={<Reader />} />
          <Route path="/buyer" element={<Buyer />} />
        </Routes>
      </ReportProvider>
    </BrowserRouter>
  );
}
```

### src/styles.css
```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=DM+Sans:wght@400;500;700&display=swap');

:root {
  color-scheme: dark;
  --bg-0: #0b0f14;
  --bg-1: #101826;
  --bg-2: #151f30;
  --surface: #162033;
  --surface-2: #1a2740;
  --stroke: rgba(255, 255, 255, 0.08);
  --text-0: #f5f7fb;
  --text-1: #c7d0e0;
  --text-2: #9aa4b5;
  --accent-1: #f6c356;
  --accent-2: #3dd6c0;
  --danger: #e86a6a;
  --glow: rgba(246, 195, 86, 0.3);
  --radius-lg: 20px;
  --radius-md: 14px;
  --radius-sm: 10px;
  --shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
  --font-display: 'Cinzel', serif;
  --font-body: 'DM Sans', sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-body);
  color: var(--text-0);
  background-color: var(--bg-0);
  background-image:
    radial-gradient(circle at 20% 20%, rgba(246, 195, 86, 0.08), transparent 40%),
    radial-gradient(circle at 80% 10%, rgba(61, 214, 192, 0.08), transparent 35%),
    radial-gradient(circle at 50% 70%, rgba(93, 78, 148, 0.18), transparent 55%),
    linear-gradient(140deg, #0b0f14 10%, #0f1728 45%, #1b1c32 100%);
  min-height: 100vh;
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

h1, h2, h3 {
  font-family: var(--font-display);
  margin: 0 0 8px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

p {
  margin: 0;
}

button,
input,
textarea,
select {
  font-family: inherit;
  color: inherit;
}

input,
textarea,
select {
  background: var(--surface-2);
  border: 1px solid var(--stroke);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  width: 100%;
  color: var(--text-0);
}

textarea {
  min-height: 120px;
  resize: vertical;
}

select {
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--text-1) 50%),
    linear-gradient(135deg, var(--text-1) 50%, transparent 50%);
  background-position: calc(100% - 20px) 55%, calc(100% - 14px) 55%;
  background-size: 6px 6px;
  background-repeat: no-repeat;
}

.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px 80px;
}

.eyebrow {
  font-size: 12px;
  letter-spacing: 0.4em;
  color: var(--accent-2);
  text-transform: uppercase;
  margin-bottom: 10px;
}

.subtitle {
  color: var(--text-1);
  max-width: 520px;
  line-height: 1.6;
}

.muted {
  color: var(--text-2);
}

.btn {
  border: 1px solid transparent;
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn.primary {
  background: linear-gradient(120deg, #f6c356, #f58f7f);
  color: #1b1d2b;
  box-shadow: 0 10px 20px rgba(246, 195, 86, 0.3);
}

.btn.ghost {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--stroke);
  color: var(--text-0);
}

.btn.danger {
  background: rgba(232, 106, 106, 0.2);
  border-color: rgba(232, 106, 106, 0.4);
  color: #ffd6d6;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.icon-btn {
  border: none;
  background: transparent;
  color: var(--text-1);
  font-size: 16px;
  cursor: pointer;
}

.icon-btn.danger {
  color: var(--danger);
}

.panel {
  background: rgba(15, 22, 36, 0.8);
  border: 1px solid var(--stroke);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.top-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.hero {
  padding: 60px 24px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, rgba(22, 32, 51, 0.9), rgba(26, 27, 48, 0.9));
  border: 1px solid var(--stroke);
  box-shadow: var(--shadow);
}

.hero h1 {
  font-size: clamp(28px, 4vw, 42px);
}

.hero-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.feature-grid {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.feature-grid article {
  padding: 20px;
  border-radius: var(--radius-md);
  background: rgba(15, 22, 36, 0.6);
  border: 1px solid var(--stroke);
}

.reader-grid {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(320px, 2fr);
  gap: 20px;
}

.report-list .panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-item {
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: border 0.2s ease, transform 0.2s ease;
}

.list-item.active {
  border-color: rgba(246, 195, 86, 0.5);
  box-shadow: 0 0 0 1px rgba(246, 195, 86, 0.2);
}

.list-title {
  font-weight: 700;
}

.list-meta {
  color: var(--text-2);
  font-size: 12px;
}

.list-question {
  color: var(--text-1);
  font-size: 14px;
  margin-top: 6px;
}

.status {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--stroke);
  color: var(--text-1);
}

.status.pending {
  border-color: rgba(61, 214, 192, 0.4);
  color: #9ef0df;
}

.status.completed {
  border-color: rgba(246, 195, 86, 0.4);
  color: #f6c356;
}

.pill-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pill {
  border-radius: 999px;
  border: 1px solid var(--stroke);
  padding: 6px 12px;
  font-size: 12px;
  background: transparent;
  color: var(--text-1);
  cursor: pointer;
}

.pill.active {
  background: rgba(61, 214, 192, 0.2);
  border-color: rgba(61, 214, 192, 0.5);
  color: #c6fff4;
}

.pill.danger.active {
  background: rgba(232, 106, 106, 0.2);
  border-color: rgba(232, 106, 106, 0.5);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.question-box {
  background: rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-md);
  padding: 16px;
  border: 1px solid var(--stroke);
  margin-bottom: 20px;
}

.question-box .label {
  font-size: 12px;
  color: var(--text-2);
  margin-bottom: 6px;
}

.template-bar,
.snippet-bar {
  margin-bottom: 20px;
  padding: 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--stroke);
  background: rgba(255, 255, 255, 0.03);
}

.section-title {
  font-weight: 600;
}

.section-subtitle {
  color: var(--text-2);
  font-size: 13px;
  margin-top: 4px;
}

.template-controls {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.editor-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.editor-card {
  border-radius: var(--radius-md);
  border: 1px solid var(--stroke);
  padding: 16px;
  background: rgba(17, 26, 40, 0.8);
}

.editor-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.drag-handle {
  font-size: 18px;
  color: var(--text-2);
  cursor: grab;
}

.card-index {
  font-weight: 700;
}

.card-subtitle {
  font-size: 12px;
  color: var(--text-2);
}

.editor-card-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-visual {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  align-items: center;
}

.card-preview {
  border-radius: var(--radius-sm);
  border: 1px solid var(--stroke);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  min-height: 160px;
}

.card-preview.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-2);
  font-size: 12px;
}

.placeholder {
  padding: 8px;
  text-align: center;
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.card-title {
  font-weight: 700;
}

.card-title-en {
  font-size: 12px;
  color: var(--text-2);
}

.editor-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.snippet-input {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.snippet-list {
  margin-top: 12px;
  display: grid;
  gap: 8px;
}

.snippet-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--stroke);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.snippet-actions {
  display: flex;
  gap: 6px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(5, 7, 12, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 24px;
}

.modal {
  width: min(860px, 100%);
  max-height: 90vh;
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--stroke);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal.preview {
  width: min(960px, 100%);
  overflow-y: auto;
}

.modal-header,
.modal-footer {
  padding: 16px 20px;
  border-bottom: 1px solid var(--stroke);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-footer {
  border-top: 1px solid var(--stroke);
  border-bottom: none;
}

.modal-controls {
  padding: 16px 20px 0;
  display: grid;
  gap: 12px;
}

.direction-toggle {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.card-grid {
  padding: 16px 20px 20px;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  overflow-y: auto;
}

.card-option {
  border-radius: var(--radius-md);
  border: 1px solid var(--stroke);
  background: rgba(255, 255, 255, 0.02);
  padding: 10px;
  text-align: left;
  cursor: pointer;
}

.card-option.selected {
  border-color: rgba(61, 214, 192, 0.6);
  box-shadow: 0 0 0 1px rgba(61, 214, 192, 0.3);
}

.card-thumb {
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  min-height: 120px;
}

.card-name-kr {
  font-weight: 600;
  margin-top: 8px;
}

.card-name-en {
  font-size: 12px;
  color: var(--text-2);
}

.card-meta {
  margin-top: 8px;
}

.buyer-report {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.card-layout {
  display: grid;
  gap: 16px;
}

.card-layout.layout-one {
  grid-template-columns: 1fr;
  justify-items: center;
}

.card-layout.layout-three {
  grid-template-columns: repeat(3, minmax(140px, 1fr));
}

.card-layout.layout-many {
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.buyer-card {
  padding: 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--stroke);
  background: rgba(255, 255, 255, 0.02);
  text-align: center;
  display: grid;
  gap: 10px;
}

.flip-card {
  perspective: 1000px;
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
  cursor: pointer;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  transition: transform 0.6s ease;
  transform-style: preserve-3d;
}

.flip-card.is-flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--stroke);
  display: flex;
  align-items: center;
  justify-content: center;
}

.flip-card-face.back {
  background: radial-gradient(circle at top, rgba(246, 195, 86, 0.25), transparent 55%),
    linear-gradient(160deg, #1b1f2e, #0f1523);
  color: var(--text-1);
  font-family: var(--font-display);
  letter-spacing: 0.2em;
}

.flip-card-face.front {
  background: rgba(0, 0, 0, 0.2);
  transform: rotateY(180deg);
}

.card-back {
  font-size: 14px;
  text-transform: uppercase;
}

.card-front-fallback {
  font-size: 12px;
  color: var(--text-2);
}

.buyer-card-meta {
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.position {
  font-size: 12px;
  color: var(--text-1);
}

.direction {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--stroke);
}

.direction.up {
  color: #93f5cf;
  border-color: rgba(147, 245, 207, 0.4);
}

.direction.rev {
  color: #ff9aa8;
  border-color: rgba(255, 154, 168, 0.4);
}

.interpretation {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.4s ease, opacity 0.4s ease;
  color: var(--text-1);
  line-height: 1.6;
}

.interpretation.open {
  max-height: 300px;
  opacity: 1;
}

.advice-box {
  padding: 18px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(246, 195, 86, 0.4);
  background: rgba(246, 195, 86, 0.08);
}

.report-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 22, 36, 0.9);
  border: 1px solid var(--stroke);
  padding: 10px 16px;
  border-radius: 999px;
  color: var(--text-0);
  z-index: 20;
  box-shadow: var(--shadow);
}

.empty-state {
  color: var(--text-2);
  text-align: center;
}

@media (max-width: 960px) {
  .reader-grid {
    grid-template-columns: 1fr;
  }

  .top-bar {
    flex-direction: column;
  }

  .card-visual {
    grid-template-columns: 1fr;
  }

  .card-layout.layout-three {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
}

@media (max-width: 600px) {
  .page {
    padding: 24px 16px 60px;
  }

  .hero {
    padding: 36px 20px;
  }

  .top-actions {
    width: 100%;
    justify-content: space-between;
  }

  .modal {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .flip-card-inner,
  .interpretation {
    transition: none;
  }
}
```

### src/contexts/ReportContext.jsx
```jsx
import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import initialReports from '../data/reports.json';

const ReportContext = createContext(null);

export function ReportProvider({ children }) {
  const [reports, setReports] = useLocalStorage('tarotReports', initialReports);
  const [activeReportId, setActiveReportId] = useLocalStorage(
    'tarotActiveReportId',
    initialReports[0]?.id ?? null
  );

  const value = useMemo(() => {
    const updateReport = (id, updater) => {
      setReports((prev) =>
        prev.map((report) => {
          if (report.id !== id) {
            return report;
          }
          const next = typeof updater === 'function' ? updater(report) : { ...report, ...updater };
          return next;
        })
      );
    };

    const replaceReports = (nextReports) => {
      setReports(nextReports);
      if (nextReports.length > 0 && !nextReports.find((item) => item.id === activeReportId)) {
        setActiveReportId(nextReports[0].id);
      }
    };

    return {
      reports,
      activeReportId,
      setActiveReportId,
      updateReport,
      replaceReports
    };
  }, [activeReportId, reports, setActiveReportId, setReports]);

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
}

export function useReportContext() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReportContext must be used within ReportProvider');
  }
  return context;
}
```

### src/hooks/useLocalStorage.js
```js
import { useEffect, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Ignore write errors (private mode, storage full, etc.)
    }
  }, [key, value]);

  return [value, setValue];
}
```

### src/data/cards.json
```json
[
  {
    "id": 0,
    "name_en": "The Fool",
    "name_kr": "광대",
    "category": "major",
    "image_url": "https://www.sacred-texts.com/tarot/pkt/img/ar00.jpg"
  },
  {
    "id": 1,
    "name_en": "The Magician",
    "name_kr": "마법사",
    "category": "major",
    "image_url": "https://www.sacred-texts.com/tarot/pkt/img/ar01.jpg"
  },
  {
    "id": 2,
    "name_en": "The High Priestess",
    "name_kr": "여사제",
    "category": "major",
    "image_url": "https://www.sacred-texts.com/tarot/pkt/img/ar02.jpg"
  },
  {
    "id": 3,
    "name_en": "The Empress",
    "name_kr": "여황제",
    "category": "major",
    "image_url": "https://www.sacred-texts.com/tarot/pkt/img/ar03.jpg"
  },
  {
    "id": 4,
    "name_en": "The Emperor",
    "name_kr": "황제",
    "category": "major",
    "image_url": "https://www.sacred-texts.com/tarot/pkt/img/ar04.jpg"
  },
  {
    "id": 31,
    "name_en": "Ace of Wands",
    "name_kr": "완드 에이스",
    "category": "wands",
    "image_url": "/images/tarot/wands_ace.webp"
  },
  {
    "id": 32,
    "name_en": "Two of Wands",
    "name_kr": "완드 2",
    "category": "wands",
    "image_url": "/images/tarot/wands_two.webp"
  },
  {
    "id": 41,
    "name_en": "Ace of Cups",
    "name_kr": "컵 에이스",
    "category": "cups",
    "image_url": "/images/tarot/cups_ace.webp"
  },
  {
    "id": 42,
    "name_en": "Two of Cups",
    "name_kr": "컵 2",
    "category": "cups",
    "image_url": "/images/tarot/cups_two.webp"
  },
  {
    "id": 51,
    "name_en": "Ace of Swords",
    "name_kr": "소드 에이스",
    "category": "swords",
    "image_url": "/images/tarot/swords_ace.webp"
  },
  {
    "id": 52,
    "name_en": "Two of Swords",
    "name_kr": "소드 2",
    "category": "swords",
    "image_url": "/images/tarot/swords_two.webp"
  },
  {
    "id": 61,
    "name_en": "Ace of Pentacles",
    "name_kr": "펜타클 에이스",
    "category": "pentacles",
    "image_url": "/images/tarot/pentacles_ace.webp"
  },
  {
    "id": 62,
    "name_en": "Two of Pentacles",
    "name_kr": "펜타클 2",
    "category": "pentacles",
    "image_url": "/images/tarot/pentacles_two.webp"
  }
]

```

### src/data/reports.json
```json
[
  {
    "id": "report_001",
    "customer_name": "김OO",
    "request_date": "2024-01-15",
    "question": "연애운이 궁금해요",
    "status": "pending",
    "spread_name": "과거/현재/미래",
    "cards": [
      {
        "card_id": 0,
        "position": "과거",
        "direction": "upright",
        "interpretation": "새로운 시작을 향한 순수한 마음이 있었어요. 상황을 가볍게 바라보며 기회를 열었던 시기입니다."
      },
      {
        "card_id": 1,
        "position": "현재",
        "direction": "reversed",
        "interpretation": "의사결정이 지연되거나 확신이 부족해 보입니다. 상대에게 전달하고 싶은 의도가 흐려질 수 있어요."
      },
      {
        "card_id": 2,
        "position": "미래",
        "direction": "upright",
        "interpretation": "직관이 중요한 시점입니다. 말하지 않아도 느껴지는 감정들을 믿어보세요."
      }
    ],
    "overall_advice": "너무 서두르지 말고 흐름을 관찰해 주세요. 대화를 시작할 타이밍을 정하면 관계가 부드럽게 풀립니다."
  },
  {
    "id": "report_002",
    "customer_name": "박OO",
    "request_date": "2024-01-12",
    "question": "이직 운을 보고 싶어요",
    "status": "completed",
    "spread_name": "상황/장애물/조언",
    "cards": [
      {
        "card_id": 31,
        "position": "상황",
        "direction": "upright",
        "interpretation": "새로운 시도를 향한 열정이 높습니다. 기회를 잡기 위한 준비가 잘 되어 있어요."
      },
      {
        "card_id": 52,
        "position": "장애물",
        "direction": "reversed",
        "interpretation": "결정 장애가 생기거나 균형을 잡기 어려운 상태입니다. 우선순위를 다시 정해보세요."
      },
      {
        "card_id": 61,
        "position": "조언",
        "direction": "upright",
        "interpretation": "재정적 안정과 현실적인 계획이 핵심입니다. 조건과 보상을 구체적으로 확인하세요."
      }
    ],
    "overall_advice": "충분한 정보 수집 후 움직이면 리스크가 줄어듭니다. 추천서나 포트폴리오를 보강해보세요."
  }
]
```

### src/pages/Home.jsx
```jsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page home">
      <header className="hero">
        <p className="eyebrow">TAROT REPORT STUDIO</p>
        <h1>타로 해석 리포트 플랫폼</h1>
        <p className="subtitle">
          리더는 빠르게 해석을 작성하고, 구매자는 카드 뒤집기와 함께
          해석을 확인하는 몰입형 리포트 경험을 제공합니다.
        </p>
        <div className="hero-actions">
          <Link className="btn primary" to="/reader">리더 페이지</Link>
          <Link className="btn ghost" to="/buyer">구매자 미리보기</Link>
        </div>
      </header>
      <section className="feature-grid">
        <article>
          <h3>모바일 중심</h3>
          <p>카드 뒤집기와 해석 펼침 애니메이션이 모바일에서도 부드럽게 동작합니다.</p>
        </article>
        <article>
          <h3>리더 생산성</h3>
          <p>스프레드 템플릿과 자동완성으로 해석 작성 속도를 높입니다.</p>
        </article>
        <article>
          <h3>감성 디자인</h3>
          <p>다크 톤과 은은한 글로우로 신비로운 타로 무드를 살렸습니다.</p>
        </article>
      </section>
    </div>
  );
}
```

### src/pages/Reader.jsx
```jsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cardsData from '../data/cards.json';
import { useReportContext } from '../contexts/ReportContext.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import CardAddModal from '../components/CardAddModal.jsx';
import CardEditorItem from '../components/CardEditorItem.jsx';
import TemplateBar from '../components/TemplateBar.jsx';
import SnippetBar from '../components/SnippetBar.jsx';
import BuyerReport from '../components/BuyerReport.jsx';

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
  const { reports, activeReportId, setActiveReportId, updateReport } = useReportContext();
  const [statusFilter, setStatusFilter] = useState('pending');
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalTargetIndex, setModalTargetIndex] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [toast, setToast] = useState('');
  const [dragIndex, setDragIndex] = useState(null);

  const [templates, setTemplates] = useLocalStorage('tarotTemplates', DEFAULT_TEMPLATES);
  const [snippets, setSnippets] = useLocalStorage('tarotSnippets', []);

  const cardsById = useMemo(() => new Map(cardsData.map((card) => [card.id, card])), []);

  const filteredReports = reports.filter((report) => report.status === statusFilter);
  const activeReport = reports.find((report) => report.id === activeReportId) || reports[0];

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
        card_id: cardId,
        position: '',
        direction,
        interpretation: ''
      };
      const nextCards = [...report.cards];
      if (modalTargetIndex !== null) {
        const target = nextCards[modalTargetIndex] || entry;
        nextCards[modalTargetIndex] = { ...target, card_id: cardId, direction };
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

  const handleSave = () => {
    showToast('임시 저장 완료');
  };

  const handleSend = () => {
    if (!activeReport) return;
    updateReport(activeReport.id, { status: 'completed' });
    setStatusFilter('completed');
    showToast('전송 완료');
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
          <button className="btn ghost" type="button" onClick={() => setPreviewOpen(true)}>미리보기</button>
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
                    <p className="list-meta">{report.request_date}</p>
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
                <div>
                  <p className="eyebrow">REPORT</p>
                  <h2>{activeReport.customer_name}</h2>
                  <p className="muted">요청일 {activeReport.request_date}</p>
                </div>
                <div className="editor-status">
                  <span className={`status ${activeReport.status}`}>
                    {activeReport.status === 'pending' ? '대기' : '완료'}
                  </span>
                </div>
              </div>
              <div className="question-box">
                <p className="label">고객 질문</p>
                <p>{activeReport.question}</p>
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
                    key={`${entry.card_id ?? 'none'}-${index}`}
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
                <button className="btn ghost" type="button" onClick={handleSave}>임시저장</button>
                <button className="btn ghost" type="button" onClick={() => setPreviewOpen(true)}>
                  미리보기
                </button>
                <button className="btn primary" type="button" onClick={handleSend}>전송</button>
              </div>
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
            <BuyerReport report={activeReport} cardsById={cardsById} showHeader={false} onReset={() => {}} />
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

```

### src/pages/Buyer.jsx
```jsx
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import cardsData from '../data/cards.json';
import { useReportContext } from '../contexts/ReportContext.jsx';
import BuyerReport from '../components/BuyerReport.jsx';

export default function Buyer() {
  const navigate = useNavigate();
  const { reports, activeReportId, setActiveReportId } = useReportContext();
  const cardsById = useMemo(() => new Map(cardsData.map((card) => [card.id, card])), []);
  const activeReport = reports.find((report) => report.id === activeReportId) || reports[0];

  return (
    <div className="page buyer">
      <header className="top-bar">
        <div>
          <p className="eyebrow">BUYER VIEW</p>
          <h1>타로 리포트 확인</h1>
          <p className="subtitle">카드를 뒤집고 해석을 확인해보세요.</p>
        </div>
        <div className="top-actions">
          <select
            value={activeReport?.id ?? ''}
            onChange={(event) => setActiveReportId(event.target.value)}
          >
            {reports.map((report) => (
              <option key={report.id} value={report.id}>
                {report.customer_name} · {report.request_date}
              </option>
            ))}
          </select>
          <button className="btn ghost" type="button" onClick={() => navigate('/')}>홈으로</button>
        </div>
      </header>

      <BuyerReport report={activeReport} cardsById={cardsById} onReset={() => navigate('/')} />
    </div>
  );
}
```

### src/components/CardAddModal.jsx
```jsx
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
```

### src/components/CardEditorItem.jsx
```jsx
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
```

### src/components/TemplateBar.jsx
```jsx
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

```

### src/components/SnippetBar.jsx
```jsx
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
```

### src/components/BuyerReport.jsx
```jsx
import { useEffect, useMemo, useState } from 'react';

const fallbackCard = {
  name_kr: '알 수 없음',
  name_en: 'Unknown',
  image_url: ''
};

const fallbackSrc =
  'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"240\" height=\"360\"><rect width=\"100%\" height=\"100%\" fill=\"%23131b2a\"/><text x=\"50%\" y=\"50%\" fill=\"%23aab3c2\" font-size=\"20\" font-family=\"sans-serif\" text-anchor=\"middle\" dominant-baseline=\"middle\">Tarot</text></svg>';

export default function BuyerReport({ report, cardsById, showHeader = true, onReset }) {
  const [flipped, setFlipped] = useState({});
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    setFlipped({});
    setExpanded({});
  }, [report?.id]);

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
    const shareData = {
      title: '타로 리포트',
      text: `${report.customer_name}님의 타로 리포트입니다.`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        alert('링크를 복사했습니다.');
      }
    } catch (error) {
      alert('공유를 완료하지 못했습니다.');
    }
  };

  return (
    <div className="buyer-report">
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

      <section className={`card-layout ${layoutClass}`}>
        {report.cards.map((entry, index) => {
          const card = cardsById.get(entry.card_id) || fallbackCard;
          const isFlipped = Boolean(flipped[index]);
          const isExpanded = Boolean(expanded[index]);
          const directionLabel = entry.direction === 'reversed' ? '역방향 ▼' : '정방향 ▲';

          return (
            <article className="buyer-card" key={`${entry.card_id ?? 'none'}-${index}`}>
              <div
                className={`flip-card ${isFlipped ? 'is-flipped' : ''}`}
                onClick={() => setFlipped((prev) => ({ ...prev, [index]: !prev[index] }))}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-face back">
                    <div className="card-back">TAROT</div>
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
                <span className="position">📍 {entry.position || '포지션'}</span>
                <span className={`direction ${entry.direction === 'reversed' ? 'rev' : 'up'}`}>
                  {directionLabel}
                </span>
              </div>
              <p className="card-title">{card.name_kr}</p>
              <p className="card-title-en">{card.name_en}</p>

              <button
                className="btn primary"
                type="button"
                onClick={() => setExpanded((prev) => ({ ...prev, [index]: !prev[index] }))}
                disabled={!isFlipped}
              >
                눌러보기 👇
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
```

---

## 8. 선택적 개선 제안

### 8-1. 이미지 최적화 (실제 WebP 파일 추가)
- **목표**: 카드 이미지 로딩 속도 개선
- **구현 사항**
  - `/public/images/tarot/` 디렉토리에 WebP 포맷 카드 이미지 배치
  - 이미지 최적화 도구 활용 (예: ImageMagick, Sharp)
    ```bash
    # 예시: PNG를 WebP로 변환
    magick input.png -quality 80 output.webp
    ```
  - srcset 및 picture 태그 활용 (옵션)
    ```jsx
    <picture>
      <source srcSet={card.image_url_webp} type="image/webp" />
      <source srcSet={card.image_url_png} type="image/png" />
      <img src={card.image_url_png} alt={card.name_kr} />
    </picture>
    ```
  - 이미지 지연 로딩 (loading="lazy") 이미 적용됨 ✅

### 8-2. 검색 기능 확장 (카테고리 교차 검색)
- **목표**: 사용자 검색 경험 개선
- **구현 사항**
  - 검색어로 여러 카테고리에서 동시 검색
  - 검색 결과에 "최근 검색" 히스토리 추가
  - 자동완성 기능 (Autocomplete)
    ```jsx
    const handleSearch = (query) => {
      // 입력 중 실시간 추천
      const suggestions = cardsData.filter(card =>
        card.name_kr.includes(query) || card.name_en.toLowerCase().includes(query)
      );
      setSuggestions(suggestions);
    };
    ```
  - 검색 결과 정렬 옵션 (가나다순, 카테고리순, 관련도순)

### 8-3. 리포트 복제 기능
- **목표**: 리더 작업 효율성 향상
- **구현 사항**
  - 기존 리포트 복제 버튼 추가
    ```jsx
    const handleDuplicateReport = (reportId) => {
      const original = reports.find(r => r.id === reportId);
      const duplicated = {
        ...original,
        id: `report_${Date.now()}`,
        customer_name: `${original.customer_name} (복사본)`,
        request_date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      replaceReports([...reports, duplicated]);
    };
    ```
  - 복제 시 상담 목록에 새 항목으로 추가
  - 수정 전 선택적 필드 초기화 옵션

### 8-4. 클라우드 동기화 (Firebase/Supabase)
- **목표**: 데이터 영속성 및 멀티 디바이스 지원
- **구현 사항**
  
  **Firebase 선택 시:**
  ```jsx
  import { initializeApp } from 'firebase/app';
  import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore';

  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    // ... 기타 설정
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // 리포트 동기화
  const syncReports = async () => {
    const querySnapshot = await getDocs(collection(db, 'reports'));
    const reports = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setReports(reports);
  };
  ```

  **Supabase 선택 시:**
  ```jsx
  import { createClient } from '@supabase/supabase-js';

  const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_KEY
  );

  // 리포트 동기화
  const syncReports = async () => {
    const { data, error } = await supabase
      .from('reports')
      .select('*');
    if (!error) setReports(data);
  };

  // 실시간 구독
  supabase
    .from('reports')
    .on('*', payload => {
      console.log('Change received!', payload);
      syncReports(); // 변경 감지 시 재동기화
    })
    .subscribe();
  ```

  - **주요 기능**
    - 로그인/회원가입 (인증 시스템)
    - 리포트 CRUD 작업
    - 실시간 데이터 동기화
    - 오프라인 모드 지원 (로컬 캐싱)
    - 충돌 해결 전략

  - **Database 스키마 예시**
    ```sql
    -- Reports 테이블
    CREATE TABLE reports (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users,
      customer_name VARCHAR(255),
      request_date DATE,
      question TEXT,
      status VARCHAR(20), -- 'pending' | 'completed'
      spread_name VARCHAR(255),
      cards JSONB,
      overall_advice TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- 인덱싱
    CREATE INDEX idx_reports_user_id ON reports(user_id);
    CREATE INDEX idx_reports_status ON reports(status);
    ```

---

## 9. 체크리스트

### 완료된 기능
- [x] 타로 리딩 해석 작성 기능
- [x] 구매자 결과 확인 페이지
- [x] 카드 뒤집기 애니메이션
- [x] 해석 펼침 기능
- [x] 공유 기능 (Web Share API)
- [x] 드래그앤드롭 카드 순서 변경
- [x] 스프레드 템플릿 저장/불러오기
- [x] 자주 쓰는 문구 저장
- [x] 미리보기 모달
- [x] 모바일 반응형 디자인

### 선택적 개선 (향후 개발 예정)
- [ ] 이미지 최적화 (실제 WebP 파일 추가)
- [ ] 검색 기능 확장 (카테고리 교차 검색)
- [ ] 리포트 복제 기능
- [ ] 클라우드 동기화 (Firebase/Supabase)

## 10. 작업 내역
### 2026-01-15
- 카드 데이터 78장 전체 구성 및 Sacred Texts 이미지 URL 적용
- 카드 ID 충돌 수정(소드/펜타클 충돌 방지)
- 리더 화면: 고객 이름/질문 입력 필드 추가
- 구매자 화면: 키워드 배지 카드 상단 고정, 이모지 🔮 적용
- 해석보기 버튼으로 해석 노출(클릭 후 펼침)
- 공유 링크 생성/복사 UI 추가, /share/:token 페이지 구성
- Supabase 연동(클라이언트, 리포트 저장/불러오기, share_token) + 테이블명 tarot_reports
- 로그인/관리자 제한(ProtectedRoute, Login, VITE_ADMIN_EMAIL)
- 브랜드 타이틀 “결쌤 타로 리포트” 반영
