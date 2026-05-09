import { supabase } from '../../lib/supabaseClient'; 
import { useState, useRef } from 'react'; // Tambahkan useRef
import { motion } from 'framer-motion';

const SktmForm = () => {
  const [loading, setLoading] = useState(false);
  
  // 1. Logic Pengaman: useRef untuk mencegah Double Click secara mutlak di tingkat memori
  const isSubmitting = useRef(false);

  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    ttl: '',
    alamat: '',
    keperluan: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 2. Cek apakah sedang dalam proses pengiriman (mencegah klik berulang)
    if (isSubmitting.current) return; 

    // Aktifkan pengunci
    isSubmitting.current = true;
    setLoading(true);

    try {
      // 3. Mengirim data ke Supabase
      const { error } = await supabase
        .from('pengajuan_surat')
        .insert([
          { 
            nik: formData.nik, 
            nama: formData.nama, 
            jenis_surat: 'SKTM',
            alamat: formData.alamat,
            status: 'pending', 
            // Data keperluan digabung untuk kemudahan pembacaan admin
            keperluan: `TTL: ${formData.ttl} | Alasan: ${formData.keperluan}` 
          }
        ]);

      if (error) throw error;

      // 4. Feedback Sukses
      alert("Pengajuan SKTM berhasil terkirim ke Admin secara Real-time!");
      
      // 5. Reset form ke awal
      setFormData({
        nik: '',
        nama: '',
        ttl: '',
        alamat: '',
        keperluan: ''
      });

    } catch (error: any) {
      alert("Gagal mengirim: " + error.message);
    } finally {
      // 6. Buka kembali kunci setelah proses selesai sepenuhnya
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-10 bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-slate-50 font-sans">
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
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-900 transition-all font-medium text-slate-700"
              value={formData.nik}
              onChange={(e) => setFormData({...formData, nik: e.target.value})}
              maxLength={16}
              required
            />
          </div>

          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Nama Lengkap Sesuai KTP"
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-900 transition-all font-medium text-slate-700"
              value={formData.nama}
              onChange={(e) => setFormData({...formData, nama: e.target.value})}
              required
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <input 
              type="text" 
              placeholder="Tempat, Tanggal Lahir"
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-900 transition-all font-medium text-slate-700"
              value={formData.ttl}
              onChange={(e) => setFormData({...formData, ttl: e.target.value})}
              required
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <textarea 
              placeholder="Alamat Lengkap di Balapulang"
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-900 transition-all min-h-[100px] font-medium text-slate-700"
              value={formData.alamat}
              onChange={(e) => setFormData({...formData, alamat: e.target.value})}
              required
            />
          </div>
        </div>

        {/* SECTION 2: DETAIL KEPERLUAN */}
        <div className="pt-6 border-t border-slate-100">
          <div className="mb-4">
            <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em] ml-1">Detail Keperluan</label>
          </div>
          <textarea 
            placeholder="Jelaskan alasan pengajuan SKTM (Contoh: Syarat KIP Kuliah atau Keringanan RS)"
            className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-900 transition-all min-h-[120px] font-medium text-slate-700"
            value={formData.keperluan}
            onChange={(e) => setFormData({...formData, keperluan: e.target.value})}
            required
          />
        </div>

        {/* BUTTON SUBMIT DENGAN LOADING STATE */}
        <motion.button 
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          disabled={loading}
          type="submit"
          className={`w-full py-5 text-white rounded-[20px] font-bold shadow-2xl transition-all uppercase tracking-widest text-sm ${
            loading 
              ? 'bg-slate-400 cursor-not-allowed shadow-none' 
              : 'bg-blue-900 shadow-blue-900/20 hover:bg-blue-800'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Sedang Mengirim...</span>
            </div>
          ) : (
            "Kirim Pengajuan Sekarang"
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default SktmForm;