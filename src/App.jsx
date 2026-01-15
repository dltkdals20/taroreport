import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Reader from './pages/Reader.jsx';
import Buyer from './pages/Buyer.jsx';
import Share from './pages/Share.jsx';
import Login from './pages/Login.jsx';
import { ReportProvider } from './contexts/ReportContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReportProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/reader"
              element={(
                <ProtectedRoute>
                  <Reader />
                </ProtectedRoute>
              )}
            />
            <Route path="/buyer" element={<Buyer />} />
            <Route path="/share/:token" element={<Share />} />
          </Routes>
        </ReportProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
