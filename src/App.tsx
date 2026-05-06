import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Tentang from './components/Tentang';
import Pelayanan from './components/Pelayanan';
import Lokasi from './components/Lokasi';
import Faq from './components/Faq';

function App() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-blue-100">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <Tentang />
        <Pelayanan />
        <Lokasi />
        <Faq />
        
        {/* Footer */}
        <footer className="py-12 bg-slate-900 text-white text-center">
          <p className="opacity-50 text-sm font-medium tracking-widest uppercase">
            © 2026 Desa Balapulang - Andra Developer
          </p>
          <footer className="py-12 bg-slate-900 text-white text-center">

          </footer>
        </footer>
      </main>
    </div>
  );
}

export default App;