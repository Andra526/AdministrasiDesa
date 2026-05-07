import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export const SkuForm = () => {
  const [formData, setFormData] = useState({
    nama: '', nik: '', usaha: '', alamat: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('pengajuan_surat').insert([
      { 
        nama_lengkap: formData.nama, 
        nik: formData.nik, 
        jenis_surat: 'SKU',
        keperluan: `Usaha: ${formData.usaha}, Alamat: ${formData.alamat}`,
        status: 'Pending'
      }
    ]);

    if (error) {
      alert("Gagal kirim data");
    } else {
      // generateSKUPDF(formData);
      alert("Berhasil! PDF Surat SKU Anda sedang diunduh.");
      setFormData({ nama: '', nik: '', usaha: '', alamat: '' });
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* HEADER DIHAPUS UNTUK TAMPILAN CLEAN */}
      
      <div className="space-y-3">
        <input 
          type="text" 
          placeholder="Nama Lengkap sesuai KTP" 
          className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 transition-all"
          onChange={(e) => setFormData({...formData, nama: e.target.value})} 
          required 
        />
        <input 
          type="text" 
          placeholder="NIK (16 Digit)" 
          className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 transition-all"
          onChange={(e) => setFormData({...formData, nik: e.target.value})} 
          required 
        />
        <input 
          type="text" 
          placeholder="Nama Usaha" 
          className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 transition-all"
          onChange={(e) => setFormData({...formData, usaha: e.target.value})} 
          required 
        />
        <textarea 
          placeholder="Alamat Lengkap Tempat Usaha" 
          className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 min-h-[120px] transition-all"
          onChange={(e) => setFormData({...formData, alamat: e.target.value})} 
          required 
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-4 bg-blue-900 text-white rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg active:scale-[0.98]"
      >
        {loading ? "Memproses..." : "Kirim Permohonan"}
      </button>
    </form>
  );
};