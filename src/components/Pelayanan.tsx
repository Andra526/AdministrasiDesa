import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ShieldCheck, Send, ChevronRight, X } from 'lucide-react';
import { SkuForm } from './Surat/SkuForm';

const Pelayanan = () => {
  // State untuk melacak form mana yang sedang dibuka
  const [activeForm, setActiveForm] = useState<string | null>(null);

  const layanan = [
    { 
      id: "sku",
      title: "Surat Keterangan Usaha", 
      desc: "Dukung UMKM Balapulang dengan izin usaha yang legal.", 
      icon: <LayoutDashboard className="text-blue-600" /> 
    },
    { 
      id: "sktm",
      title: "SKTM Online", 
      desc: "Akses bantuan sosial dan pendidikan dengan surat keterangan tidak mampu.", 
      icon: <ShieldCheck className="text-emerald-600" /> 
    },
    { 
      id: "umum",
      title: "Surat Pengantar Umum", 
      desc: "Urus domisili dan keterangan lain secara instan.", 
      icon: <Send className="text-purple-600" /> 
    },
  ];

  return (
    <section id="pelayanan" className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold text-slate-900 mb-4 uppercase tracking-tighter">Layanan Online Warga</h2>
        <p className="text-slate-500">Pilih jenis layanan administrasi yang Anda butuhkan di bawah ini.</p>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {layanan.map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            onClick={() => setActiveForm(item.id)} // Set form aktif saat diklik
            className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="mb-6 p-4 bg-slate-50 w-fit rounded-2xl group-hover:bg-blue-50 transition-colors">
              {item.icon}
            </div>
            <h4 className="text-xl font-bold mb-4">{item.title}</h4>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">{item.desc}</p>
            <div className="flex items-center font-bold text-blue-900 text-sm">
              Buat Surat <ChevronRight size={16} className="ml-1" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overlay Modal untuk Form */}
      <AnimatePresence>
        {activeForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
              {/* Tombol Tutup */}
              <button 
                onClick={() => setActiveForm(null)}
                className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8">
                {activeForm === 'sku' && <SkuForm />}
                {activeForm === 'sktm' && (
                  <div className="text-center py-10 text-slate-400 font-medium">
                    Form SKTM sedang dalam pengembangan...
                  </div>
                )}
                {activeForm === 'umum' && (
                  <div className="text-center py-10 text-slate-400 font-medium">
                    Form Umum sedang dalam pengembangan...
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Pelayanan;