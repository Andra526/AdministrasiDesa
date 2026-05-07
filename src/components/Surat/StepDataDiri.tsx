import { motion } from 'framer-motion';
import { ArrowRight, User, Fingerprint, MapPin } from 'lucide-react';

export const StepDataDiri = ({ onNext, data, setData }: any) => {
  
  const inputStyle = "w-full p-4 md:p-5 bg-slate-50 border border-transparent rounded-[1.5rem] focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium shadow-inner";

  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      exit={{ x: -20, opacity: 0 }} 
      className="space-y-8"
    >
      {/* Banner Info Kecil */}
      <div className="bg-blue-50/50 p-4 rounded-2xl text-blue-700 text-[11px] font-bold border border-blue-100 flex items-center gap-3">
        <div className="bg-blue-600 text-white p-1 rounded-md">
          <User size={14} />
        </div>
        <span className="uppercase tracking-wider">Langkah 1: Lengkapi Data Identitas Pemohon</span>
      </div>

      <div className="space-y-6">
        {/* Nama Lengkap */}
        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-2">Nama Lengkap Sesuai KTP</label>
          <div className="relative">
            <input 
              type="text" 
              value={data.nama}
              onChange={(e) => setData({...data, nama: e.target.value})}
              placeholder="Masukkan nama lengkap Anda" 
              className={inputStyle} 
            />
          </div>
        </div>

        {/* NIK */}
        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-2">Nomor Induk Kependudukan (NIK)</label>
          <div className="relative">
            <input 
              type="number" 
              value={data.nik}
              onChange={(e) => setData({...data, nik: e.target.value})}
              placeholder="16 Digit NIK" 
              className={inputStyle} 
            />
          </div>
        </div>

        {/* Alamat */}
        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-2">Alamat Domisili</label>
          <div className="relative">
            <textarea 
              value={data.alamat}
              onChange={(e) => setData({...data, alamat: e.target.value})}
              placeholder="Alamat Lengkap (RT/RW, No. Rumah)" 
              className={`${inputStyle} min-h-[120px] resize-none`} 
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={onNext} 
        className="w-full py-5 bg-blue-900 text-white rounded-[1.8rem] font-bold flex items-center justify-center gap-3 hover:bg-blue-800 active:scale-[0.97] transition-all shadow-xl shadow-blue-100 mt-4 group"
      >
        Lanjut Upload Berkas 
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>

      <p className="text-center text-[10px] text-slate-400 font-medium italic">
        *Pastikan data yang Anda masukkan sudah benar sebelum lanjut.
      </p>
    </motion.div>
  );
};