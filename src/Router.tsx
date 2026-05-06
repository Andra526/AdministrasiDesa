import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App'; 
import { AdminDashboard } from './pages/AdminDashboard';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Utama (Landing Page) */}
        <Route path="/" element={<App />} />
        
        {/* Halaman Dashboard Admin */}
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;