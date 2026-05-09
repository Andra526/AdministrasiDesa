import { motion } from 'framer-motion';
import { CheckCircle, Home, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export const StepSelesai = ({ formData }: { formData: any }) => {
  const [isSyncing, setIsSyncing] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const kirimDataKeSupabase = async () => {
      // 1. Validasi awal: pastikan data esensial tidak kosong
      if (!formData || !formData.nik) {
        setIsSyncing(false);
        return;
      }

      try {
        // 2. Proses Insert ke tabel 'pengajuan_surat'
        // Nama key di bawah ini HARUS sama persis dengan kolom di SQL Supabase
        const { error } = await supabase
          .from('pengajuan_surat')
          .insert([
            { 
              nik: formData.nik, 
              nama: formData.nama,             // Diperbaiki: sesuai kolom 'nama' di SQL
              jenis_surat: formData.jenisSurat, // Sesuai kolom 'jenis_surat'
              alamat: formData.alamat || '',
              keperluan: formData.keperluan || '', // Menambah kelengkapan data
              url_ktp: formData.url_ktp,        // Pastikan berisi string path/URL
              url_kk: formData.url_kk,          // Pastikan berisi string path/URL
              status: 'pending'                 // Konsisten dengan default di SQL
            }
          ]);

        if (error) throw error;

        console.log("Data berhasil masuk ke sistem Digidesa!");
        setIsError(false);
      } catch (err: any) {
        console.error("Gagal kirim ke database:", err.message);
        setIsError(true);
      } finally {
        setIsSyncing(false);
      }
    };

    kirimDataKeSupabase();
  }, [formData]);

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-10 space-y-6"
    >
      {isSyncing ? (
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-blue-600 animate-spin" />
          <p className="text-slate-500 font-bold">Menyinkronkan data...</p>
        </div>
      ) : isError ? (
        <div className="space-y-4">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <AlertCircle size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-900">Gagal Mengirim Data</h3>
          <p className="text-slate-500 px-6 text-sm">
            Terjadi kendala saat menghubungkan ke database. Pastikan koneksi internet stabil atau hubungi admin desa.
          </p>
        </div>
      ) : (
        <>
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <CheckCircle size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Permohonan Terkirim!</h3>
          <p className="text-slate-500 px-6 text-sm leading-relaxed">
            Data Anda telah berhasil dikirim ke balai desa. Admin akan melakukan validasi berkas dalam waktu 1x24 jam.
          </p>
        </>
      )}
      
      <div className="pt-4">
        <button 
          onClick={() => window.location.href = '/'} 
          className="inline-flex items-center gap-2 py-4 px-10 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 group"
        >
          <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" /> 
          Kembali ke Beranda
        </button>
      </div>
    </motion.div>
  );
};