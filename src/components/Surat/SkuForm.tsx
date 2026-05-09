import { useState } from 'react';

// 1. Hapus import supabase di sini karena pengiriman dilakukan di akhir (StepUploadBerkas)
export const SkuForm = ({ onNext, setData }: { onNext: () => void, setData: (data: any) => void }) => {
  const [formData, setLocalFormData] = useState({
    nama: '', nik: '', usaha: '', alamat: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 2. Simpan data ke state utama di PengajuanSurat.tsx
    // Kita menggabungkan data usaha dan alamat ke dalam field 'keperluan'
    setData((prev: any) => ({
      ...prev,
      nama: formData.nama,
      nik: formData.nik,
      // Data usaha disimpan di keperluan agar rapi saat masuk database nanti
      keperluan: `Nama Usaha: ${formData.usaha}, Alamat Usaha: ${formData.alamat}`,
      jenisSurat: 'SKU' 
    }));

    // 3. Pindah ke tahap berikutnya (Upload Berkas)
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <input 
          type="text" 
          placeholder="Nama Lengkap sesuai KTP" 
          className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-700"
          value={formData.nama}
          onChange={(e) => setLocalFormData({...formData, nama: e.target.value})} 
          required 
        />
        <input 
          type="text" 
          placeholder="NIK (16 Digit)" 
          className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-700"
          value={formData.nik}
          onChange={(e) => setLocalFormData({...formData, nik: e.target.value})} 
          required 
        />
        <input 
          type="text" 
          placeholder="Nama Usaha" 
          className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-700"
          value={formData.usaha}
          onChange={(e) => setLocalFormData({...formData, usaha: e.target.value})} 
          required 
        />
        <textarea 
          placeholder="Alamat Lengkap Tempat Usaha" 
          className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 min-h-[120px] transition-all font-medium text-slate-700"
          value={formData.alamat}
          onChange={(e) => setLocalFormData({...formData, alamat: e.target.value})} 
          required 
        />
      </div>

      <button 
        type="submit" 
        className="w-full py-4 bg-blue-900 text-white rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg active:scale-[0.98] uppercase tracking-wider text-sm"
      >
        Lanjutkan ke Upload Berkas
      </button>
    </form>
  );
};