import { MapPin, Phone, Mail } from 'lucide-react';

const Lokasi = () => {
  return (
    <section id="lokasi" className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-8 text-blue-900">Kontak & Lokasi</h2>
          <div className="space-y-8">
            <div className="flex gap-4 p-6 bg-slate-50 rounded-[2rem]">
              <div className="p-3 bg-white rounded-xl text-blue-900 shadow-sm"><MapPin /></div>
              <div>
                <p className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-1">Alamat Kantor</p>
                <p className="text-slate-600">Jl. Raya Balapulang No. 1, Kec. Balapulang, Kabupaten Tegal, Jawa Tengah 52464</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-3 text-slate-600 font-medium">
                <Phone size={18} className="text-blue-900" /> (0283) 465123
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-medium ml-6">
                <Mail size={18} className="text-blue-900" /> info@balapulang.desa.id
              </div>
            </div>
          </div>
        </div>
        <div className="h-[450px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15840.457852345097!2d109.1030704!3d-7.001662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fb9b5d3a3a3a3%3A0x1a2b3c4d5e6f7g8h!2sBalapulang%2C%20Tegal%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1715000000000!5m2!1sen!2sid" 
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Lokasi;