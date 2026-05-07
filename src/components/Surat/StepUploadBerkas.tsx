import { motion } from 'framer-motion';
import { Upload, ArrowLeft, Send } from 'lucide-react';

export const StepUploadBerkas = ({ onNext, onPrev }: any) => (
  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
    <div className="text-sm font-black text-slate-800 uppercase tracking-widest border-l-4 border-blue-600 pl-3">
       Upload Dokumen Pendukung
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {['Foto KTP', 'Foto KK'].map((label) => (
        <label key={label} className="border-2 border-dashed border-slate-200 p-8 rounded-[2rem] text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group block">
          <Upload className="mx-auto mb-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
          <p className="text-xs font-bold text-slate-700">{label}</p>
          <p className="text-[10px] text-slate-400 mt-1">Klik untuk pilih file</p>
          <input type="file" className="hidden" />
        </label>
      ))}
    </div>
    <div className="flex gap-3 pt-4">
      <button onClick={onPrev} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
        <ArrowLeft size={18} /> Kembali
      </button>
      <button onClick={onNext} className="flex-[2] py-4 bg-blue-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-100">
        Kirim Permohonan <Send size={18} />
      </button>
    </div>
  </motion.div>
);