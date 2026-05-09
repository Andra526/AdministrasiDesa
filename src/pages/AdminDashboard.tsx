import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Trash2, Calendar, 
  FileText, FileSpreadsheet, RefreshCw, LogOut,
  Clock, ChevronRight, Eye, Search, FileDown // Tambahkan FileDown
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// IMPORT UNTUK PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminDashboard = () => {
  const [pengajuan, setPengajuan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('pengajuan_surat')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setPengajuan(data);
    if (error) console.error("Error fetch:", error.message);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel('db-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pengajuan_surat' }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // --- FUNGSI CETAK PDF ---
  const generatePDF = (item: any) => {
    const doc = new jsPDF();

    // 1. Kop Surat
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("PEMERINTAH KABUPATEN TEGAL", 105, 15, { align: "center" });
    doc.text("KECAMATAN BALAPULANG", 105, 22, { align: "center" });
    doc.setFontSize(16);
    doc.text("KANTOR KEPALA DESA DIGITAL", 105, 30, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35); 

    // 2. Judul
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`SURAT KETERANGAN: ${item.jenis_surat}`, 105, 45, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(`Nomor: ${item.id.substring(0, 8)}/KDS/${new Date().getFullYear()}`, 105, 52, { align: "center" });

    // 3. Tabel Data
    autoTable(doc, {
      startY: 60,
      theme: 'plain',
      body: [
        ['Nama Lengkap', ':', item.nama],
        ['NIK', ':', item.nik],
        ['Jenis Layanan', ':', item.jenis_surat],
        ['Tanggal Pengajuan', ':', new Date(item.created_at).toLocaleDateString('id-ID')],
        ['Status', ':', item.status],
        ['Detail Keperluan', ':', item.keperluan || '-'],
      ],
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 5 },
        2: { cellWidth: 'auto' }
      },
      styles: { fontSize: 11, cellPadding: 3 }
    });

    // 4. Tanda Tangan
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.text("Balapulang, " + new Date().toLocaleDateString('id-ID'), 140, finalY);
    doc.text("Kepala Desa Digital,", 140, finalY + 7);
    doc.text("( ____________________ )", 140, finalY + 35);

    doc.save(`Surat_${item.jenis_surat}_${item.nama}.pdf`);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (isSubmitting) return; 
    setIsSubmitting(true);
    const { error } = await supabase.from('pengajuan_surat').update({ status: newStatus }).eq('id', id);
    if (error) alert("Gagal update status!");
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (isSubmitting) return;
    if (confirm("Hapus data ini secara permanen?")) {
      setIsSubmitting(true);
      const { error } = await supabase.from('pengajuan_surat').delete().eq('id', id);
      if (error) alert("Gagal menghapus data!");
      setIsSubmitting(false);
    }
  };

  const downloadBerkas = (item: any) => {
    if (!item.url_ktp && !item.url_kk) return alert("Warga tidak mengunggah berkas.");
    const openFile = (path: string) => {
      const { data } = supabase.storage.from('berkas-surat').getPublicUrl(path);
      window.open(data.publicUrl, '_blank');
    };
    if (item.url_ktp && item.url_kk) {
      if (confirm("Lihat KTP? (Klik 'Cancel' untuk melihat KK)")) openFile(item.url_ktp);
      else openFile(item.url_kk);
    } else openFile(item.url_ktp || item.url_kk);
  };

  const exportToCSV = () => {
    const headers = "Nama,NIK,Layanan,Status,Tanggal\n";
    const rows = pengajuan.map(item => `${item.nama},${item.nik},${item.jenis_surat},${item.status},${item.created_at}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Digidesa_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredData = pengajuan
    .filter(item => filter === 'Semua' ? true : item.status === filter)
    .filter(item => 
      item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.nik?.includes(searchQuery)
    );

  const stats = [
    { label: 'Total Masuk', value: pengajuan.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Perlu ACC', value: pengajuan.filter(x => x.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
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
        <button onClick={() => window.location.href = '/'} className="flex items-center gap-3 px-5 py-4 text-slate-500 font-bold hover:text-red-400 transition-all relative z-10 mt-auto">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                <RefreshCw size={12} className={loading || isSubmitting ? "animate-spin" : ""} /> Realtime Active
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Dashboard <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">Admin</span></h1>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="relative w-full md:w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Cari Nama / NIK..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              {['Semua', 'pending', 'ACC'].map((s) => (
                <button 
                  key={s} onClick={() => setFilter(s)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${filter === s ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
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

        {/* Table */}
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
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-8 py-10 bg-slate-50/30"></td>
                    </tr>
                  ))
                ) : (
                  <AnimatePresence mode='popLayout'>
                    {filteredData.length > 0 ? filteredData.map((item) => (
                      <motion.tr 
                        layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}
                        key={item.id} className="hover:bg-blue-50/30 transition-all group"
                      >
                        <td className="px-8 py-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black group-hover:bg-blue-600 transition-all">
                              {item.nama ? item.nama.charAt(0) : '?'}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 tracking-tight">{item.nama}</p>
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
                            {item.status === 'pending' && (
                              <button 
                                disabled={isSubmitting}
                                onClick={() => handleUpdateStatus(item.id, 'ACC')} 
                                className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                              >
                                <CheckCircle size={18} />
                              </button>
                            )}
                            {/* TOMBOL BARU: CETAK PDF */}
                            <button 
                              onClick={() => generatePDF(item)} 
                              className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all" 
                              title="Cetak PDF"
                            >
                              <FileDown size={18} />
                            </button>
                            
                            <button onClick={() => downloadBerkas(item)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all" title="Lihat Berkas">
                              <Eye size={18} />
                            </button>
                            <button 
                              disabled={isSubmitting}
                              onClick={() => handleDelete(item.id)} 
                              className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold italic">
                          Tidak ada data yang ditemukan.
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;