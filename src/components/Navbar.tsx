import { Landmark, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Pastikan import ini ada

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const waNumber = "6288220007296";

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-[100] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="p-2.5 bg-blue-900 rounded-xl shadow-lg shadow-blue-900/20">
              <Landmark className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-blue-900 leading-none">DIGIDESA</span>
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Digitalisasi Administrasi Desa</span>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex gap-8 font-semibold text-slate-500 text-sm uppercase tracking-widest items-center">
            <a href="#tentang" className="hover:text-blue-900 transition-colors">Tentang</a>
            
            {/* Dropdown Buat Surat Desktop - Langsung ke Form */}
            <div className="relative group cursor-pointer">
              <button className="flex items-center gap-1 hover:text-blue-900 transition-colors uppercase tracking-widest text-sm font-semibold">
                Buat Surat <ChevronDown size={14} />
              </button>
              
              <div className="absolute top-full left-0 w-64 bg-white shadow-2xl rounded-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-slate-50 translate-y-2 group-hover:translate-y-0 z-[120]">
                <Link to="/pengajuan?jenis=sktm" className="block p-3 hover:bg-blue-50 rounded-xl transition-colors font-bold text-slate-700 hover:text-blue-900">
                  SKTM
                  <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Kesehatan & Pendidikan</span>
                </Link>
                <Link to="/pengajuan?jenis=sku" className="block p-3 hover:bg-blue-50 rounded-xl transition-colors font-bold text-slate-700 hover:text-blue-900 border-t border-slate-50">
                  Surat Izin Usaha (SKU)
                  <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Legalitas UMKM</span>
                </Link>
                <Link to="/pengajuan?jenis=umum" className="block p-3 hover:bg-blue-50 rounded-xl transition-colors font-bold text-slate-700 hover:text-blue-900 border-t border-slate-50">
                  Surat Domisili
                  <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Keterangan Tinggal</span>
                </Link>
              </div>
            </div>

            <a href="#pelayanan" className="hover:text-blue-900 transition-colors">Kebutuhan Dokumen</a>
            <a href="#lokasi" className="hover:text-blue-900 transition-colors">Lokasi</a>
            <a href="#faq" className="hover:text-blue-900 transition-colors">FAQ</a>
          </div>

          <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-blue-900 text-white rounded-full text-sm font-bold shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all"
            >
              Hubungi Kami
            </motion.button>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-slate-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 left-0 w-full bg-white p-6 flex flex-col gap-6 md:hidden shadow-2xl z-[110] border-b border-slate-100"
        >
          <div className="flex flex-col gap-5">
            <a href="#tentang" onClick={() => setIsOpen(false)} className="text-sm font-bold text-slate-700">Tentang Desa</a>
            
            {/* Menu Surat di Mobile - Mengarah ke Form Pengajuan */}
            <div className="flex flex-col gap-3 pl-4 border-l-2 border-blue-900">
              <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Pelayanan Administratif</span>
              <Link to="/pengajuan?jenis=sktm" onClick={() => setIsOpen(false)} className="text-sm font-bold text-slate-500 italic hover:text-blue-900 transition-all"> 
                - Surat Keterangan Tidak Mampu (SKTM)
              </Link>
              <Link to="/pengajuan?jenis=sku" onClick={() => setIsOpen(false)} className="text-sm font-bold text-slate-500 italic hover:text-blue-900 transition-all"> 
                - Surat Keterangan Usaha (SKU)
              </Link>
              <Link to="/pengajuan?jenis=umum" onClick={() => setIsOpen(false)} className="text-sm font-bold text-slate-500 italic hover:text-blue-900 transition-all"> 
                - Surat Domisili (Umum)
              </Link>
            </div>

            <a href="#pelayanan" onClick={() => setIsOpen(false)} className="text-sm font-bold text-slate-700">Persyaratan Dokumen</a>
            <a href="#lokasi" onClick={() => setIsOpen(false)} className="text-sm font-bold text-slate-700">Lokasi</a>
            <a href="#faq" onClick={() => setIsOpen(false)} className="text-sm font-bold text-slate-700">FAQ</a>
          </div>

          <div className="h-[1px] bg-slate-100 w-full" />

          <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="w-full">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 bg-blue-900 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-900/20 active:bg-blue-800 transition-all"
            >
              Hubungi Kami (WhatsApp)
            </motion.button>
          </a>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;