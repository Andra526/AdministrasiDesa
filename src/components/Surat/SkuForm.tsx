import { useState } from 'react';

export const SkuForm = ({ onNext, setData }: { onNext: () => void, setData: (data: any) => void }) => {
  const [formData, setLocalFormData] = useState({
    nama: '',
    nik: '',
    ttl: '',       // Tempat Tanggal Lahir
    pekerjaan: '', // Pekerjaan
    alamat: '',    
    usaha: ''      
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setData((prev: any) => ({
      ...prev,
      nama_lengkap: formData.nama,
      nik: formData.nik,
      // Data digabung agar masuk ke kolom 'keperluan' di database
      keperluan: `TTL: ${formData.ttl}, Pekerjaan: ${formData.pekerjaan}, Usaha: ${formData.usaha}, Alamat: ${formData.alamat}`,
      jenis_surat: 'SKU' 
    }));

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Input Nama */}
        <input 
          type="text" 
          placeholder="Nama Lengkap (Sesuai KTP)" 
          className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-700"
          value={formData.nama}
          onChange={(e) => setLocalFormData({...formData, nama: e.target.value})} 
          required 
        />
        {/* Input NIK */}
        <input 
          type="text" 
          placeholder="NIK (16 Digit)" 
          className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-700"
          value={formData.nik}
          onChange={(e) => setLocalFormData({...formData, nik: e.target.value})} 
          required 
        />
        {/* INPUT BARU: Tempat Tanggal Lahir */}
        <input 
          type="text" 
          placeholder="Tempat, Tanggal Lahir" 
          className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-700"
          value={formData.ttl}
          onChange={(e) => setLocalFormData({...formData, ttl: e.target.value})} 
          required 
        />
        {/* INPUT BARU: Pekerjaan */}
        <input 
          type="text" 
          placeholder="Pekerjaan" 
          className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-700"
          value={formData.pekerjaan}
          onChange={(e) => setLocalFormData({...formData, pekerjaan: e.target.value})} 
          required 
        />
      </div>

      {/* Input Nama Usaha */}
      <input 
        type="text" 
        placeholder="Nama / Jenis Usaha (Contoh: Peternak Sapi)" 
        className="w-full p-4 bg-blue-50/50 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold text-blue-700 placeholder:text-blue-300"
        value={formData.usaha}
        onChange={(e) => setLocalFormData({...formData, usaha: e.target.value})} 
        required 
      />

      {/* Input Alamat */}
      <textarea 
        placeholder="Alamat Lengkap (Sesuai KTP)" 
        className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 min-h-[100px] transition-all font-medium text-slate-700"
        value={formData.alamat}
        onChange={(e) => setLocalFormData({...formData, alamat: e.target.value})} 
        required 
      />

      <button 
        type="submit" 
        className="w-full py-4 bg-[#0F172A] text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-lg active:scale-[0.98] uppercase tracking-widest text-xs"
      >
        Lanjutkan ke Upload Berkas
      </button>
    </form>
  );
};