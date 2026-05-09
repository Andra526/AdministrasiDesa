import { useState } from 'react';
import { motion } from 'framer-motion';

// 1. Hapus import supabase dan useRef karena pengiriman dipindah ke StepUploadBerkas
export const SktmForm = ({ onNext, setData }: { onNext: () => void, setData: (data: any) => void }) => {
  const [formData, setLocalFormData] = useState({
    nik: '',
    nama: '',
    ttl: '',
    alamat: '',
    keperluan: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 2. Simpan data ke state utama di PengajuanSurat.tsx
    setData((prev: any) => ({
      ...prev,
      nik: formData.nik,
      nama: formData.nama,
      jenisSurat: 'SKTM',
      alamat: formData.alamat,
      // Kita simpan TTL ke dalam keperluan agar admin bisa melihatnya di dashboard
      keperluan: `TTL: ${formData.ttl} | Alasan: ${formData.keperluan}`
    }));

    // 3. Pindah ke tahap upload berkas (Step 2)
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-10 bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-slate-50 font-sans">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-blue-900 tracking-tighter uppercase">Pengajuan SKTM</h2>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mt-1">Desa Digital</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em] ml-1">Informasi Identitas</label>
          </div>
          
          <input 
            type="text" 
            placeholder="NIK (16 Digit)"
            className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-900 transition-all font-medium text-slate-700"
            value={formData.nik}
            onChange={(e) => setLocalFormData({...formData, nik: e.target.value})}
            maxLength={16}
            required
          />

          <input 
            type="text" 
            placeholder="Nama Lengkap Sesuai KTP"
            className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-900 transition-all font-medium text-slate-700"
            value={formData.nama}
            onChange={(e) => setLocalFormData({...formData, nama: e.target.value})}
            required
          />

          <div className="md:col-span-2">
            <input 
              type="text" 
              placeholder="Tempat, Tanggal Lahir"
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-900 transition-all font-medium text-slate-700"
              value={formData.ttl}
              onChange={(e) => setLocalFormData({...formData, ttl: e.target.value})}
              required
            />
          </div>

          <div className="md:col-span-2">
            <textarea 
              placeholder="Alamat Lengkap"
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-900 transition-all min-h-[100px] font-medium text-slate-700"
              value={formData.alamat}
              onChange={(e) => setLocalFormData({...formData, alamat: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <label className="block mb-4 text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em] ml-1">Detail Keperluan</label>
          <textarea 
            placeholder="Jelaskan alasan pengajuan SKTM (Contoh: Syarat KIP Kuliah)"
            className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-900 transition-all min-h-[120px] font-medium text-slate-700"
            value={formData.keperluan}
            onChange={(e) => setLocalFormData({...formData, keperluan: e.target.value})}
            required
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-5 bg-blue-900 text-white rounded-[20px] font-bold shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all uppercase tracking-widest text-sm"
        >
          Lanjutkan ke Upload Berkas
        </motion.button>
      </form>
    </div>
  );
};

export default SktmForm;