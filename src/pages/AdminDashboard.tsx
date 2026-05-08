import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Trash2, Calendar, 
  FileText, FileSpreadsheet, RefreshCw, LogOut,
  Clock, ChevronRight, Eye
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [pengajuan, setPengajuan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Semua');
  const navigate = useNavigate();

  // --- 1. LOGIC FETCH DATA & REALTIME ---
  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pengajuan_surat')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setPengajuan(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Setup Realtime: Mendengarkan INSERT, UPDATE, dan DELETE
    const channel = supabase
      .channel('db-realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'pengajuan_surat' }, 
        () => fetchData() // Panggil ulang data jika ada perubahan apa pun
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // --- 2. LOGIC ADMIN ACTIONS ---
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('pengajuan_surat')
      .update({ status: newStatus })
      .eq('id', id);
    if (error) alert("Gagal update status!");
    // Realtime akan otomatis memicu fetchData()
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus data ini secara permanen?")) {
      await supabase.from('pengajuan_surat').delete().eq('id', id);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/login'); // Kembali ke halaman login
    } else {
      alert("Gagal Logout");
    }
  };

  const downloadBerkas = (item: any) => {
    const filePath = item.url_ktp || item.url_kk;
    if (!filePath) return alert("Warga tidak mengunggah berkas.");
    
    const { data } = supabase.storage.from('berkas-surat').getPublicUrl(filePath);
    window.open(data.publicUrl, '_blank');
  };

  const exportToCSV = () => {
    const headers = "Nama,NIK,Layanan,Status,Tanggal\n";
    const rows = pengajuan.map(item => 
      `${item.nama_lengkap},${item.nik},${item.jenis_surat},${item.status},${item.created_at}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Digidesa_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredData = filter === 'Semua' ? pengajuan : pengajuan.filter(item => item.status === filter);

  // Stats Calculation (Otomatis update karena memakai state 'pengajuan')
  const stats = [
    { label: 'Total Masuk', value: pengajuan.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Perlu ACC', value: pengajuan.filter(x => x.status === 'Pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Selesai', value: pengajuan.filter(x => x.status === 'ACC').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 bg-[#0F172A] m-5 rounded-[2.5rem] p-8 flex-col text-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-14 relative z-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40 font-black text-xl">D</div>
          <div>
            <h2 className="font-black text-lg tracking-tight leading-none">DIGIDESA</h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 text-blue-400">Tegal Digital</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 relative z-10">
          <button className="w-full flex items-center justify-between px-5 py-4 bg-white/10 rounded-2xl font-bold text-white transition-all border border-white/5 shadow-inner">
            <div className="flex items-center gap-3"><FileText size={18} /> Antrean</div>
            <ChevronRight size={14} className="opacity-50" />
          </button>
          <button onClick={exportToCSV} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/5 rounded-2xl font-bold text-slate-400 hover:text-white transition-all group">
            <FileSpreadsheet size={18} className="group-hover:text-emerald-400" /> Export Data
          </button>
        </nav>

        {/* Action Logout */}
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-5 py-4 text-slate-500 font-bold hover:text-red-400 transition-all relative z-10 mt-auto"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Realtime Active
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Dashboard <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">Admin</span></h1>
          </div>

          <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            {['Semua', 'Pending', 'ACC'].map((s) => (
              <button 
                key={s} onClick={() => setFilter(s)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${filter === s ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
              key={stat.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all cursor-default group"
            >
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Table - Luxury Style */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">Data Warga</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">Surat / Layanan</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode='popLayout'>
                  {filteredData.map((item) => (
                    <motion.tr 
                      layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}
                      key={item.id} className="hover:bg-blue-50/30 transition-all group"
                    >
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black group-hover:bg-blue-600 transition-all uppercase">
                            {item.nama_lengkap.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 tracking-tight">{item.nama_lengkap}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-widest uppercase">NIK: {item.nik}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-blue-600 flex items-center gap-2">
                            {item.jenis_surat}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1">
                            <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          item.status === 'ACC' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'ACC' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <div className="flex gap-2 justify-end">
                          {item.status === 'Pending' && (
                            <button onClick={() => handleUpdateStatus(item.id, 'ACC')} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button onClick={() => downloadBerkas(item)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all" title="Lihat Berkas">
                            <Eye size={18} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredData.length === 0 && !loading && (
              <div className="p-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4 italic">Kosong</div>
                <p className="text-slate-400 font-bold text-sm">Tidak ada antrean surat saat ini.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;