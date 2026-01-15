import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page home">
      <header className="hero">
        <p className="eyebrow">GYEOL TAROT REPORT</p>
        <h1>결쌤 타로 리포트</h1>
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
