import { motion } from 'framer-motion';
import { ArrowRight, FileText, Upload, Heart, GraduationCap, Users, Calendar, Briefcase, Trash2 } from 'lucide-react';

export const SpKtpForm = ({ onNext, data, setData }: any) => {
  
  const inputStyle = "w-full p-4 bg-slate-50 border border-transparent rounded-[1.2rem] focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium shadow-inner text-sm";
  const labelStyle = "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* SECTION 1: JENIS PERMOHONAN */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
        <label className={labelStyle}>Permohonan KTP</label>
        <div className="flex flex-wrap gap-2">
          {['Baru', 'Perpanjang', 'Penggantian'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setData({...data, permohonan_ktp: item})}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${data.permohonan_ktp === item ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2: DATA DETAIL (SESUAI FORM FISIK) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        <div className="space-y-1">
          <label className={labelStyle}>Tanggal Lahir</label>
          <input type="text" placeholder="Tegal, 10-02-2005" className={inputStyle} value={data.ttl} onChange={(e)=>setData({...data, ttl: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className={labelStyle}>Pekerjaan</label>
          <input type="text" placeholder="Pelajar/Mahasiswa" className={inputStyle} value={data.pekerjaan} onChange={(e)=>setData({...data, pekerjaan: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className={labelStyle}>Pendidikan</label>
          <input type="text" placeholder="Tamat SD/Sederajat" className={inputStyle} value={data.pendidikan} onChange={(e)=>setData({...data, pendidikan: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className={labelStyle}>Status Perkawinan</label>
          <select className={inputStyle} value={data.status_kawin} onChange={(e)=>setData({...data, status_kawin: e.target.value})}>
            <option value="Belum Kawin">Belum Kawin</option>
            <option value="Kawin">Kawin</option>
            <option value="Cerai">Cerai</option>
          </select>
        </div>
      </div>

      {/* SECTION 3: UPLOAD BERKAS KHUSUS */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">
          <Upload size={16} className="text-blue-600" /> Berkas Persyaratan (Foto/Scan)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: 'fc_ktp', label: 'KTP Lama / Surat Kehilangan', icon: <User size={14}/> },
            { id: 'fc_kk', label: 'Kartu Keluarga (KK)', icon: <Users size={14}/> },
            { id: 'fc_sampah', label: 'Kartu Sampah (Lunas)', icon: <Trash2 size={14}/> },
            { id: 'sp_rt', label: 'Surat Pengantar RT/RW', icon: <FileText size={14}/> },
          ].map((berkas) => (
            <div key={berkas.id} className="relative group">
              <label className="flex items-center justify-between p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400 group-hover:text-blue-600">
                    {berkas.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase">{berkas.label}</span>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => setData({...data, [berkas.id]: e.target.files?.[0]})} 
                />
                <div className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-black">
                  {data[berkas.id] ? 'TERPILIH' : 'UPLOAD'}
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={onNext}
        className="w-full py-5 bg-blue-900 text-white rounded-[1.5rem] font-black shadow-xl shadow-blue-200 flex items-center justify-center gap-3 group"
      >
        KIRIM PERMOHONAN KTP
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};