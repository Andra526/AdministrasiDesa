import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, User, Briefcase, CalendarDays } from 'lucide-react';

export const StepDataDiri = ({ onNext, data, setData }: any) => {
  
  const inputStyle = "w-full p-4 md:p-5 bg-slate-50 border border-transparent rounded-[1.5rem] focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium shadow-inner";

  // Cek apakah jenis surat yang sedang diajukan adalah SKU
  const isSKU = data.jenis_surat === 'SKU' || data.jenisSurat === 'SKU';

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
        <div className="space-y-2 text-left">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-2">Nama Lengkap Sesuai KTP</label>
          <input 
            type="text" 
            value={data.nama}
            onChange={(e) => setData({...data, nama: e.target.value})}
            placeholder="Masukkan nama lengkap Anda" 
            className={inputStyle} 
          />
        </div>

        {/* NIK */}
        <div className="space-y-2 text-left">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-2">Nomor Induk Kependudukan (NIK)</label>
          <input 
            type="number" 
            value={data.nik}
            onChange={(e) => setData({...data, nik: e.target.value})}
            placeholder="16 Digit NIK" 
            className={inputStyle} 
          />
        </div>

        {/* KHUSUS SKU: INPUT INI HANYA MUNCUL JIKA SURAT KETERANGAN USAHA */}
        <AnimatePresence>
          {isSKU && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tempat Tanggal Lahir */}
                <div className="space-y-2 text-left">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-2 flex items-center gap-2">
                    <CalendarDays size={12} className="text-blue-500" /> Tempat, Tanggal Lahir
                  </label>
                  <input 
                    type="text" 
                    value={data.ttl}
                    onChange={(e) => setData({...data, ttl: e.target.value})}
                    placeholder="Contoh: Tegal, 22-04-1979" 
                    className={inputStyle} 
                  />
                </div>

                {/* Pekerjaan */}
                <div className="space-y-2 text-left">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-2 flex items-center gap-2">
                    <Briefcase size={12} className="text-blue-500" /> Pekerjaan
                  </label>
                  <input 
                    type="text" 
                    value={data.pekerjaan}
                    onChange={(e) => setData({...data, pekerjaan: e.target.value})}
                    placeholder="Contoh: Wiraswasta" 
                    className={inputStyle} 
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alamat */}
        <div className="space-y-2 text-left">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-2">Alamat Domisili</label>
          <textarea 
            value={data.alamat}
            onChange={(e) => setData({...data, alamat: e.target.value})}
            placeholder="Alamat Lengkap (RT/RW, No. Rumah)" 
            className={`${inputStyle} min-h-[120px] resize-none`} 
          />
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