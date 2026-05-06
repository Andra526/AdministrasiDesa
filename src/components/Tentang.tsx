import { motion } from 'framer-motion';
import { Info, FileText } from 'lucide-react';

const Tentang = () => {
  return (
    <section id="tentang" className="py-24 bg-slate-50 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-4">Profil Balapulang</h2>
          <p className="text-slate-500">Mengenal lebih dekat visi dan misi Balai Desa Balapulang, Tegal.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            whileHover={{ y: -10 }}
            className="p-10 bg-white rounded-[2.5rem] shadow-sm border border-slate-100"
          >
            <div className="w-12 h-12 bg-blue-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/30">
              <Info className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-800">Visi Desa</h3>
            <p className="text-slate-500 leading-relaxed italic border-l-4 border-blue-900 pl-4">
              "Terwujudnya Desa Balapulang yang mandiri, sejahtera, dan terdepan dalam pelayanan administrasi berbasis digital di wilayah Tegal."
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="p-10 bg-white rounded-[2.5rem] shadow-sm border border-slate-100"
          >
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-600/30">
              <FileText className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-800">Misi Desa</h3>
            <ul className="text-slate-500 space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> 
                Meningkatkan transparansi administrasi desa secara online.
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> 
                Mendorong digitalisasi UMKM Balapulang agar naik kelas.
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> 
                Memberikan pelayanan publik yang cepat, tepat, dan ramah warga.
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Tentang;