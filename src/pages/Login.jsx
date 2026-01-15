import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { adminEmails, isEmailAllowed } from '../lib/authConfig.js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, loading, isSupabaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      const target = location.state?.from?.pathname || '/reader';
      navigate(target, { replace: true });
    }
  }, [location.state, navigate, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!email || !password) {
      setMessage('이메일과 비밀번호를 입력해 주세요.');
      return;
    }

    if (!isEmailAllowed(email)) {
      setMessage('승인된 관리자 계정만 로그인할 수 있습니다.');
      return;
    }

    const { error } = await signIn(email, password);

    if (error) {
      setMessage(error.message || '로그인에 실패했습니다.');
      return;
    }
  };

  return (
    <div className="page auth">
      <div className="auth-card panel">
        <p className="eyebrow">READER LOGIN</p>
        <h1>리더 로그인</h1>
        <p className="subtitle">리더 페이지는 관리자 로그인 후 접근할 수 있습니다.</p>

        {!isSupabaseConfigured && (
          <div className="auth-alert">
            <p>Supabase 환경변수가 설정되지 않았습니다.</p>
            <p className="muted">VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY를 확인해 주세요.</p>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>이메일</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@email.com"
              autoComplete="email"
            />
          </label>
          <label className="field">
            <span>비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호"
              autoComplete="current-password"
            />
          </label>

          {message && <p className="auth-message">{message}</p>}

          <button className="btn primary" type="submit" disabled={loading || !isSupabaseConfigured}>
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
