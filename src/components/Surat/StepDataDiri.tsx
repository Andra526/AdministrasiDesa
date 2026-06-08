import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, User, Briefcase, CalendarDays, Heart, GraduationCap, Droplets, Users, FileText } from 'lucide-react';

export const StepDataDiri = ({ onNext, data, setData }: any) => {
  
  const inputStyle = "w-full p-4 md:p-5 bg-slate-50 border border-transparent rounded-[1.5rem] focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium shadow-inner";
  const labelStyle = "text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-2 flex items-center gap-2";

  // Cek Jenis Surat
  const isSKU = data.jenisSurat?.toUpperCase() === 'SKU' || data.jenis_surat?.toUpperCase() === 'SKU';
  const isKTP = data.jenisSurat?.toUpperCase() === 'KTP' || data.jenis_surat?.toUpperCase() === 'KTP';
  const isSKCK = data.jenisSurat?.toUpperCase() === 'SKCK';

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
        {/* INPUT UMUM: NAMA & NIK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-left">
            <label className={labelStyle}>Nama Lengkap Sesuai KTP</label>
            <input 
              type="text" 
              value={data.nama}
              onChange={(e) => setData({...data, nama: e.target.value.toUpperCase()})}
              placeholder="NAMA LENGKAP" 
              className={inputStyle} 
            />
          </div>
          <div className="space-y-2 text-left">
            <label className={labelStyle}>Nomor Induk Kependudukan (NIK)</label>
            <input 
              type="number" 
              value={data.nik}
              onChange={(e) => setData({...data, nik: e.target.value})}
              placeholder="16 DIGIT NIK" 
              className={inputStyle} 
            />
          </div>
        </div>

        {/* KONDISIONAL FORM */}
        <AnimatePresence mode="wait">
          {(isSKU || isKTP || isSKCK) && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* TTL - Muncul untuk Semua */}
                <div className="space-y-2 text-left">
                  <label className={labelStyle}><CalendarDays size={12} className="text-blue-500" /> Tempat, Tanggal Lahir</label>
                  <input type="text" value={data.ttl} onChange={(e) => setData({...data, ttl: e.target.value})} placeholder="Tegal, 10-02-2005" className={inputStyle} />
                </div>

                {/* Pekerjaan - Muncul untuk Semua */}
                <div className="space-y-2 text-left">
                  <label className={labelStyle}><Briefcase size={12} className="text-blue-500" /> Pekerjaan</label>
                  <input type="text" value={data.pekerjaan} onChange={(e) => setData({...data, pekerjaan: e.target.value})} placeholder="Contoh: Wiraswasta" className={inputStyle} />
                </div>

                {/* INPUT KHUSUS SKCK */}
                {isSKCK && (
                  <>
                    <div className="space-y-2 text-left">
                      <label className={labelStyle}><Heart size={12} className="text-blue-500" /> Agama</label>
                      <input type="text" value={data.agama} onChange={(e) => setData({...data, agama: e.target.value})} placeholder="Agama" className={inputStyle} />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className={labelStyle}><Users size={12} className="text-blue-500" /> Kewarganegaraan</label>
                      <input type="text" value={data.kewarganegaraan} onChange={(e) => setData({...data, kewarganegaraan: e.target.value})} placeholder="WNI" className={inputStyle} />
                    </div>
                    <div className="space-y-2 text-left md:col-span-2">
                      <label className={labelStyle}><FileText size={12} className="text-blue-500" /> Keperluan SKCK</label>
                      <input type="text" value={data.keperluan} onChange={(e) => setData({...data, keperluan: e.target.value})} placeholder="Contoh: Melamar Pekerjaan" className={inputStyle} />
                    </div>
                  </>
                )}

                {/* INPUT KHUSUS KTP */}
                {isKTP && (
                  <>
                    <div className="space-y-2 text-left">
                      <label className={labelStyle}><Users size={12} className="text-blue-500" /> Jenis Kelamin</label>
                      <select className={inputStyle} value={data.jenis_kelamin} onChange={(e) => setData({...data, jenis_kelamin: e.target.value})}>
                        <option value="">Pilih...</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                    <div className="space-y-2 text-left">
                      <label className={labelStyle}><Droplets size={12} className="text-blue-500" /> Golongan Darah</label>
                      <input type="text" value={data.golongan_darah} onChange={(e) => setData({...data, golongan_darah: e.target.value})} placeholder="-" className={inputStyle} />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className={labelStyle}><Heart size={12} className="text-blue-500" /> Agama</label>
                      <input type="text" value={data.agama} onChange={(e) => setData({...data, agama: e.target.value})} placeholder="Contoh: Islam" className={inputStyle} />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className={labelStyle}><GraduationCap size={12} className="text-blue-500" /> Pendidikan</label>
                      <input type="text" value={data.pendidikan} onChange={(e) => setData({...data, pendidikan: e.target.value})} placeholder="Tamat SD/Sederajat" className={inputStyle} />
                    </div>
                    <div className="space-y-2 text-left md:col-span-2">
                      <label className={labelStyle}>Status Perkawinan</label>
                      <select className={inputStyle} value={data.status_kawin} onChange={(e) => setData({...data, status_kawin: e.target.value})}>
                        <option value="Belum Kawin">Belum Kawin</option>
                        <option value="Kawin">Kawin</option>
                        <option value="Cerai Hidup">Cerai Hidup</option>
                        <option value="Cerai Mati">Cerai Mati</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alamat */}
        <div className="space-y-2 text-left">
          <label className={labelStyle}>Alamat Domisili (Sesuai KTP)</label>
          <textarea 
            value={data.alamat}
            onChange={(e) => setData({...data, alamat: e.target.value})}
            placeholder="Contoh: Banjaranyar RT 005/ RW 002" 
            className={`${inputStyle} min-h-[100px] resize-none`} 
          />
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={onNext} 
        disabled={!data.nama || !data.nik}
        className="w-full py-5 bg-blue-900 text-white rounded-[1.8rem] font-bold flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-xl disabled:bg-slate-200 group"
      >
        Lanjut Upload Berkas <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>

      <p className="text-center text-[10px] text-slate-400 font-medium italic">
        *Pastikan data yang Anda masukkan sudah benar sesuai dokumen asli.
      </p>
    </motion.div>
  );
};  