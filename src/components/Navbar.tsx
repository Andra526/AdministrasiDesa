import { Landmark, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-[100] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="p-2.5 bg-blue-900 rounded-xl shadow-lg shadow-blue-900/20">
            <Landmark className="text-white" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter text-blue-900 leading-none">BALAPULANG</span>
            <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Desa Digital</span>
          </div>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex gap-8 font-semibold text-slate-500 text-sm uppercase tracking-widest">
            <a href="#tentang" className="hover:text-blue-900 transition-colors">Tentang</a>
            <a href="#pelayanan" className="hover:text-blue-900 transition-colors">Layanan</a>
            <a href="#lokasi" className="hover:text-blue-900 transition-colors">Lokasi</a>
            <a href="#faq" className="hover:text-blue-900 transition-colors">FAQ</a>
            <a href="#Buat surat" className="hover:text-blue-900 transition-colors">Buat Surat</a>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 bg-blue-900 text-white rounded-full text-sm font-bold shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all"
          >
            Hubungi Kami
          </motion.button>
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
    // Tambahkan z-[110] dan bg-white supaya pasti di depan Hero
    className="absolute top-20 left-0 w-full bg-white p-6 flex flex-col gap-6 md:hidden shadow-2xl z-[110] border-b border-slate-100"
  >
          {/* Link Navigasi */}
          <div className="flex flex-col gap-5">
            <a href="#tentang" onClick={() => setIsOpen(false)} className="text-sm font-bold text-slate-700 hover:text-blue-900 transition-colors">Tentang Desa</a>
            <a href="#pelayanan" onClick={() => setIsOpen(false)} className="text-sm font-bold text-slate-700 hover:text-blue-900 transition-colors">Layanan Publik</a>
            <a href="#lokasi" onClick={() => setIsOpen(false)} className="text-sm font-bold text-slate-700 hover:text-blue-900 transition-colors">Lokasi</a>
            <a href="#faq" onClick={() => setIsOpen(false)} className="text-sm font-bold text-slate-700 hover:text-blue-900 transition-colors">FAQ</a>
            <a href="#Buat surat" onClick={() => setIsOpen(false)} className="text-sm font-bold text-slate-700 hover:text-blue-900 transition-colors text-blue-900">Buat Surat</a>
          </div>

          {/* Garis Pemisah Tipis */}
          <div className="h-[1px] bg-slate-100 w-full" />

          {/* Tombol Hubungi Kami di Mobile */}
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 bg-blue-900 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-900/20 active:bg-blue-800 transition-all"
          >
            Hubungi Kami
          </motion.button>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;