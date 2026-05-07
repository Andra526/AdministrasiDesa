import { motion } from 'framer-motion';
import { CheckCircle, Home } from 'lucide-react';

export const StepSelesai = () => (
  <motion.div 
    initial={{ scale: 0.9, opacity: 0 }} 
    animate={{ scale: 1, opacity: 1 }}
    className="text-center py-10 space-y-6"
  >
    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
      <CheckCircle size={48} />
    </div>
    <h3 className="text-2xl font-black text-slate-900">Permohonan Terkirim!</h3>
    <p className="text-slate-500 px-6">Data Anda telah berhasil dikirim ke balai desa. Silahkan cek status secara berkala.</p>
    <button 
      onClick={() => window.location.href = '/'} 
      className="inline-flex items-center gap-2 py-4 px-8 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
    >
      <Home size={18} /> Kembali ke Beranda
    </button>
  </motion.div>
);