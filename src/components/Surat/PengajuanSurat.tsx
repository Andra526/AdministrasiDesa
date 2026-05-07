import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, FileUp, CheckCircle, ArrowLeft } from 'lucide-react';
import { StepDataDiri } from './StepDataDiri';
import { StepUploadBerkas } from './StepUploadBerkas';
import { StepSelesai } from './StepSelesai';

const PengajuanSurat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [judulSurat, setJudulSurat] = useState("Surat Keterangan");
  const [formData, setFormData] = useState({
    nama: '', nik: '', alamat: '', berkasKtp: null, berkasKk: null
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jenis = params.get('jenis');

    if (jenis === 'sku') setJudulSurat("Surat Keterangan Usaha (SKU)");
    else if (jenis === 'sktm') setJudulSurat("Surat Keterangan Tidak Mampu (SKTM)");
    else if (jenis === 'umum') setJudulSurat("Surat Keterangan Domisili / Umum");
    else setJudulSurat("Pengajuan Surat Online");
  }, [location]);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-10 px-3 md:px-4 flex flex-col items-center justify-center font-sans">
      {/* Tombol Kembali - Responsif */}
      <button 
        onClick={() => navigate('/')}
        className="mb-4 flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-medium text-xs md:text-sm self-start max-w-2xl mx-auto"
      >
        <ArrowLeft size={16} /> <span className="hidden sm:inline">Kembali ke Beranda</span><span className="sm:hidden">Kembali</span>
      </button>

      <div className="w-full max-w-2xl bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header Section - Responsif */}
        <div className="p-5 md:p-8 border-b border-slate-50 bg-white">
           <div className="mb-2 text-[8px] md:text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] text-center">
             Layanan Mandiri Online
           </div>
           <h2 className="text-lg md:text-xl font-extrabold text-slate-800 mb-6 md:mb-10 text-center uppercase tracking-tight px-2">
             FORM PENGAJUAN: <span className="text-blue-700 block sm:inline">{judulSurat}</span>
           </h2>
           
           {/* Stepper dengan Progress Line - Responsif */}
           <div className="flex justify-between relative px-2 md:px-10">
              {/* Jalur Background */}
              <div className="absolute top-4 md:top-5 left-10 right-10 h-[2px] md:h-[3px] bg-slate-100 -z-0" />
              
              {/* Jalur Progress Aktif */}
              <motion.div 
                className="absolute top-4 md:top-5 left-10 h-[2px] md:h-[3px] bg-blue-600 -z-0"
                initial={{ width: "0%" }}
                animate={{ width: step === 1 ? "0%" : step === 2 ? "45%" : "85%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />

              {[
                { id: 1, icon: <User size={16} />, label: "Data" },
                { id: 2, icon: <FileUp size={16} />, label: "Berkas" },
                { id: 3, icon: <CheckCircle size={16} />, label: "Selesai" }
              ].map((item) => (
                <div key={item.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-500 border-2 md:border-4 ${
                    step >= item.id 
                    ? 'bg-blue-600 text-white border-blue-100 shadow-lg' 
                    : 'bg-white text-slate-300 border-slate-50'
                  }`}>
                    {item.id < step ? <CheckCircle size={16} /> : item.icon}
                  </div>
                  <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider ${
                    step >= item.id ? 'text-blue-700' : 'text-slate-400'
                  }`}>
                    {item.label}
                  </span>
                </div>
              ))}
           </div>
        </div>

        {/* Content Body - Responsif */}
        <div className="p-6 md:p-12 bg-[#fcfdfe]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <StepDataDiri 
                  onNext={nextStep} 
                  data={formData} 
                  setData={setFormData} 
                />
              )}
              {step === 2 && (
                <StepUploadBerkas 
                  onNext={nextStep} 
                  onPrev={prevStep} 
                  data={formData} 
                  setData={setFormData} 
                />
              )}
              {step === 3 && (
                <StepSelesai />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Footer bantuan untuk mobile */}
      <p className="mt-6 text-slate-400 text-[10px] text-center px-4">
        Butuh bantuan? Hubungi kantor desa di jam kerja (08:00 - 15:00)
      </p>
    </div>
  );
};

export default PengajuanSurat;