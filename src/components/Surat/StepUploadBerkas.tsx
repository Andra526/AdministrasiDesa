import { motion } from 'framer-motion';
import { Upload, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export const StepUploadBerkas = ({ onNext, onPrev, data, setData }: any) => {
  const [isUploading, setIsUploading] = useState(false);

  // Fungsi untuk menangani pilihan file dan memasukkannya ke state
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      setData({ ...data, [field]: e.target.files[0] });
    }
  };

  const handleUploadAndSubmit = async () => {
    if (!data.berkasKtp || !data.berkasKk) {
      alert("Harap unggah kedua berkas (KTP & KK) terlebih dahulu.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Proses Upload KTP
      const ktpName = `${Date.now()}_${data.nik}_ktp`;
      const { data: ktpRes, error: ktpErr } = await supabase.storage
        .from('berkas-surat')
        .upload(ktpName, data.berkasKtp);

      if (ktpErr) throw ktpErr;

      // 2. Proses Upload KK
      const kkName = `${Date.now()}_${data.nik}_kk`;
      const { data: kkRes, error: kkErr } = await supabase.storage
        .from('berkas-surat')
        .upload(kkName, data.berkasKk);

      if (kkErr) throw kkErr;

      // 3. Simpan nama file hasil upload ke state utama untuk disimpan ke DB di step terakhir
      setData({ 
        ...data, 
        url_ktp: ktpRes.path, 
        url_kk: kkRes.path 
      });

      onNext(); // Pindah ke StepSelesai
    } catch (error: any) {
      console.error("Error upload:", error.message);
      alert("Gagal mengunggah berkas. Pastikan koneksi aman.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      exit={{ x: -20, opacity: 0 }} 
      className="space-y-6"
    >
      <div className="text-sm font-black text-slate-800 uppercase tracking-widest border-l-4 border-blue-600 pl-3">
         Upload Dokumen Pendukung
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input KTP */}
        <label className={`border-2 border-dashed p-8 rounded-[2rem] text-center transition-all cursor-pointer group block ${data.berkasKtp ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'}`}>
          <Upload className={`mx-auto mb-3 ${data.berkasKtp ? 'text-emerald-600' : 'text-slate-400 group-hover:text-blue-600'}`} />
          <p className="text-xs font-bold text-slate-700">{data.berkasKtp ? "KTP Terpilih" : "Foto KTP"}</p>
          <p className="text-[10px] text-slate-400 mt-1">{data.berkasKtp ? data.berkasKtp.name : "Klik untuk pilih file"}</p>
          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'berkasKtp')} />
        </label>

        {/* Input KK */}
        <label className={`border-2 border-dashed p-8 rounded-[2rem] text-center transition-all cursor-pointer group block ${data.berkasKk ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'}`}>
          <Upload className={`mx-auto mb-3 ${data.berkasKk ? 'text-emerald-600' : 'text-slate-400 group-hover:text-blue-600'}`} />
          <p className="text-xs font-bold text-slate-700">{data.berkasKk ? "KK Terpilih" : "Foto KK"}</p>
          <p className="text-[10px] text-slate-400 mt-1">{data.berkasKk ? data.berkasKk.name : "Klik untuk pilih file"}</p>
          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'berkasKk')} />
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button 
          onClick={onPrev} 
          disabled={isUploading}
          className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all disabled:opacity-50"
        >
          <ArrowLeft size={18} /> Kembali
        </button>
        
        <button 
          onClick={handleUploadAndSubmit} 
          disabled={isUploading}
          className="flex-[2] py-4 bg-blue-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-100 disabled:bg-blue-400"
        >
          {isUploading ? (
            <>Memproses... <Loader2 size={18} className="animate-spin" /></>
          ) : (
            <>Kirim Permohonan <Send size={18} /></>
          )}
        </button>
      </div>
    </motion.div>
  );
};