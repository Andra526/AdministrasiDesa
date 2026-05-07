import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export const SkuForm = () => { // Sesuaikan nama dengan nama file agar konsisten
  const [formData, setFormData] = useState({
    nama: '', nik: '', usaha: '', alamat: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('pengajuan_surat').insert([
      { 
        nama_lengkap: formData.nama, 
        nik: formData.nik, 
        jenis_surat: 'SKU (Surat Keterangan Usaha)',
        keperluan: `Usaha: ${formData.usaha}, Alamat: ${formData.alamat}`,
        status: 'Pending'
      }
    ]);

    if (error) {
      alert("Gagal kirim: " + error.message);
    } else {
      alert("Berhasil dikirim ke desa!");
      // Reset form setelah berhasil
      setFormData({ nama: '', nik: '', usaha: '', alamat: '' });
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-[32px] shadow-sm border border-slate-100 space-y-4">
      <div className="mb-4">
        <h2 className="text-xl font-black text-blue-900 uppercase tracking-tight">Form SKU</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Surat Keterangan Usaha</p>
      </div>

      <div className="space-y-3">
        <input 
          type="text" 
          placeholder="Nama Lengkap sesuai KTP" 
          className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 transition-all font-medium" 
          onChange={(e) => setFormData({...formData, nama: e.target.value})} 
          required 
        />
        <input 
          type="text" 
          placeholder="NIK (16 Digit)" 
          className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 transition-all font-medium" 
          onChange={(e) => setFormData({...formData, nik: e.target.value})} 
          required 
        />
        <input 
          type="text" 
          placeholder="Nama Usaha" 
          className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 transition-all font-medium" 
          onChange={(e) => setFormData({...formData, usaha: e.target.value})} 
          required 
        />
        <textarea 
          placeholder="Alamat Lengkap Tempat Usaha" 
          className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 transition-all font-medium min-h-[100px]" 
          onChange={(e) => setFormData({...formData, alamat: e.target.value})} 
          required 
        />
      </div>

      <button 
        type="submit"
        className="w-full py-4 bg-blue-900 text-white rounded-2xl font-bold shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
      >
        Kirim Permohonan
      </button>
    </form>
  );
};