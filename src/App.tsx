import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Tentang from './components/Tentang';
import Gallery from './components/Gallery';
import Pelayanan from './components/Pelayanan';
import Lokasi from './components/Lokasi';
import Faq from './components/Faq';
import PengajuanSurat from './components/Surat/PengajuanSurat';

// Kita buat komponen pembungkus untuk Landing Page agar App.tsx tetap rapi
const HomePage = () => (
  <>
    <Hero />
    <Tentang />
    <Gallery />
    <Pelayanan />
    <Lokasi />
    <Faq />
  </>
);

function App() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-blue-100">
      {/* Navbar tetap di luar Routes agar selalu muncul di tiap halaman */}
      <Navbar />
      
      <main className="pt-20">
        <Routes>
          {/* Jalur untuk Halaman Utama */}
          <Route path="/" element={<HomePage />} />
          
          {/* Jalur untuk Halaman Form Pengajuan */}
          <Route path="/pengajuan" element={<PengajuanSurat />} />
        </Routes>
        
        {/* Footer juga di luar Routes agar selalu muncul di bawah */}
        <footer className="py-12 bg-slate-900 text-white text-center">
          <p className="opacity-50 text-sm font-medium tracking-widest uppercase">
            © 2026 Desa Balapulang - Andra Developer
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;