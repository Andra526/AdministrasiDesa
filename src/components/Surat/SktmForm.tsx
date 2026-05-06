import { supabase } from '../../lib/supabaseClient'; 
import { useState } from 'react';
import { motion } from 'framer-motion';

const SktmForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    ttl: '',
    alamat: '',
    keperluan: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mengirim data ke Supabase secara asynchronous
    const { error } = await supabase
      .from('pengajuan_surat')
      .insert([
        { 
          nik: formData.nik, 
          nama_lengkap: formData.nama, 
          jenis_surat: 'SKTM',
          keperluan: `TTL: ${formData.ttl} | Alamat: ${formData.alamat} | Alasan: ${formData.keperluan}` 
        }
      ]);

    setLoading(false);

    if (error) {
      alert("Gagal mengirim: " + error.message);
    } else {
      alert("Pengajuan SKTM berhasil terkirim ke Admin secara Real-time!");
      // Reset form ke awal
      setFormData({
        nik: '',
        nama: '',
        ttl: '',
        alamat: '',
        keperluan: ''
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-10 bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-slate-50">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-blue-900 tracking-tighter">PENGAJUAN SKTM</h2>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mt-1">Desa Digital Balapulang</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: BIODATA DIRI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em] ml-1">Informasi Identitas</label>
          </div>
          
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="NIK (16 Digit)"
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-900 transition-all font-medium"
              value={formData.nik}
              onChange={(e) => setFormData({...formData, nik: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Nama Lengkap Sesuai KTP"
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-900 transition-all font-medium"
              value={formData.nama}
              onChange={(e) => setFormData({...formData, nama: e.target.value})}
              required
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <input 
              type="text" 
              placeholder="Tempat, Tanggal Lahir"
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-900 transition-all font-medium"
              value={formData.ttl}
              onChange={(e) => setFormData({...formData, ttl: e.target.value})}
              required
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <textarea 
              placeholder="Alamat Lengkap di Balapulang"
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-900 transition-all min-h-[100px] font-medium"
              value={formData.alamat}
              onChange={(e) => setFormData({...formData, alamat: e.target.value})}
              required
            />
          </div>
        </div>

        {/* SECTION 2: DETAIL SURAT */}
        <div className="pt-6 border-t border-slate-100">
          <div className="mb-4">
            <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em] ml-1">Detail Keperluan</label>
          </div>
          <textarea 
            placeholder="Jelaskan alasan pengajuan SKTM (Contoh: Syarat KIP Kuliah atau Keringanan RS)"
            className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-900 transition-all min-h-[120px] font-medium"
            value={formData.keperluan}
            onChange={(e) => setFormData({...formData, keperluan: e.target.value})}
            required
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="w-full py-5 bg-blue-900 text-white rounded-[20px] font-bold shadow-2xl shadow-blue-900/20 hover:bg-blue-800 disabled:bg-slate-300 transition-all uppercase tracking-widest text-sm"
        >
          {loading ? "Proses Sinkronisasi..." : "Kirim Pengajuan Sekarang"}
        </motion.button>
      </form>
    </div>
  );
};

export default SktmForm;