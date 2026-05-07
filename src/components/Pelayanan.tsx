import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ShieldCheck, Send, X, Info, ArrowRight, FileEdit } from 'lucide-react';

const Pelayanan = () => {
  const [activeInfo, setActiveInfo] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#info-', '');
      if (['sku', 'sktm', 'umum'].includes(hash)) {
        setActiveInfo(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const layanan = [
    { 
      id: "sku",
      title: "Surat Keterangan Usaha", 
      desc: "Informasi mengenai berkas yang diperlukan untuk penerbitan izin usaha UMKM.", 
      icon: <LayoutDashboard size={28} className="text-blue-600" />,
      syarat: ["KTP Asli / Fotokopi", "Kartu Keluarga (KK)", "Data Nama & Alamat Usaha", "Foto Lokasi Usaha (Opsional)"]
    },
    { 
      id: "sktm",
      title: "SKTM Online", 
      desc: "Syarat pengajuan surat keterangan tidak mampu untuk bantuan sosial/pendidikan.", 
      icon: <ShieldCheck size={28} className="text-emerald-600" />,
      syarat: ["KTP Orang Tua", "Kartu Keluarga", "Surat Pengantar RT/RW setempat", "Pernyataan penghasilan"]
    },
    { 
      id: "umum",
      title: "Surat Pengantar Umum", 
      desc: "Persyaratan berkas untuk administrasi domisili atau keterangan pindah.", 
      icon: <Send size={28} className="text-purple-600" />,
      syarat: ["KTP & KK Aktif", "Alamat Tujuan", "Menyertakan alasan yang jelas"]
    },
  ];

  const currentLayanan = layanan.find(l => l.id === activeInfo);

  return (
    <section id="pelayanan" className="py-16 md:py-28 px-4 md:px-6 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto text-center mb-12 md:mb-20">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Kebutuhan Dokumen</h2>
        <p className="text-slate-500 text-sm md:text-lg max-w-2xl mx-auto">Klik pada kartu untuk melihat daftar persyaratan dokumen yang wajib Anda siapkan.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {layanan.map((item) => (
          <motion.div 
            key={item.id}
            // FIX SHADOW BARIS 58: Menggunakan soft shadow luxury
            whileHover={{ y: -12, shadow:"0 25px 50px -12px rgba(0, 0, 0, 0.08)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveInfo(item.id)}
            className="p-8 bg-white border border-slate-100 rounded-[2.5rem] transition-all cursor-pointer group relative overflow-hidden shadow-sm"
          >
            <div className="mb-6 p-5 bg-slate-50 w-fit rounded-3xl group-hover:bg-blue-50 transition-all duration-500">
              {item.icon}
            </div>
            <h4 className="text-xl md:text-2xl font-bold mb-4 text-slate-800">{item.title}</h4>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-4">
              {item.desc}
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              Lihat Persyaratan <ArrowRight size={16} />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeInfo && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[999] flex items-end md:items-center justify-center p-0 md:p-6"
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-white rounded-t-[2.5rem] md:rounded-[3rem] w-full max-w-lg relative shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => { setActiveInfo(null); window.history.replaceState(null, '', ' '); }}
                className="absolute top-6 right-6 p-3 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-600 transition-all z-20"
              >
                <X size={20} />
              </button>

              <div className="p-8 md:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                    {currentLayanan?.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{currentLayanan?.title}</h3>
                    <p className="text-sm text-slate-500 font-medium">Persyaratan Berkas</p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {currentLayanan?.syarat.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                      <span className="text-sm md:text-base font-semibold">{s}</span>
                    </div>
                  ))}
                </div>

                {/* INTEGRASI TOMBOL BUAT SURAT: Mengarahkan ke PengajuanSurat berdasarkan ID */}
                <button 
  onClick={() => window.location.href = `/pengajuan?jenis=${currentLayanan?.id}`}
  className="w-full py-5 bg-blue-900 text-white rounded-[1.8rem] font-bold flex items-center justify-center gap-3 hover:bg-blue-800 active:scale-[0.97] transition-all shadow-xl shadow-blue-100"
>
  Buat Surat Sekarang
</button>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <p className="text-[10px] text-center text-slate-400 italic leading-relaxed">
                    Pastikan semua dokumen di atas telah siap dalam bentuk file digital (Foto/PDF) sebelum melanjutkan pengisian.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Pelayanan;