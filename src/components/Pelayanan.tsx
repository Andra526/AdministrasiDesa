import { motion } from 'framer-motion';
import { LayoutDashboard, ShieldCheck, Send, ChevronRight } from 'lucide-react';


const Pelayanan = () => {
  const layanan = [
    { title: "Surat Keterangan Usaha", desc: "Dukung UMKM Balapulang dengan izin usaha yang legal.", icon: <LayoutDashboard className="text-blue-600" /> },
    { title: "SKTM Online", desc: "Akses bantuan sosial dan pendidikan dengan surat keterangan tidak mampu.", icon: <ShieldCheck className="text-emerald-600" /> },
    { title: "Surat Pengantar Umum", desc: "Urus domisili dan keterangan lain secara instan.", icon: <Send className="text-purple-600" /> },
  ];

  return (
    <section id="pelayanan" className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Layanan Online Warga</h2>
        <p className="text-slate-500">Pilih jenis layanan administrasi yang Anda butuhkan di bawah ini.</p>
      </div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {layanan.map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
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
    </section>
  );
};

export default Pelayanan;