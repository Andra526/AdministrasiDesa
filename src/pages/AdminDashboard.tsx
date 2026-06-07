import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Trash2, Calendar, 
  FileText, FileSpreadsheet, RefreshCw, LogOut,
  Clock, ChevronRight, Eye, Search, FileDown 
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

// IMPORT UNTUK PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pengajuan, setPengajuan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- PROTEK DASHBOARD & FETCH DATA ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      fetchData();
    };

    checkUser();

    // Realtime listener agar dashboard update otomatis
    const channel = supabase
      .channel('db-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pengajuan_surat' }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('pengajuan_surat')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setPengajuan(data);
    if (error) console.error("Error fetch:", error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Gagal logout:", error.message);
    } else {
      navigate('/login');
    }
  };

  // --- FUNGSI CETAK PDF FORMAL (Dinamis) ---
  const generatePDF = async (item: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. Watermark
    doc.setTextColor(245, 245, 245); 
    doc.setFontSize(60);
    doc.setFont("helvetica", "bold");
    doc.text("DOKUMEN ASLI", pageWidth / 2, pageHeight / 2, { align: "center", angle: 45 });

    // 2. Kop Surat
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("PEMERINTAH KABUPATEN TEGAL", 105, 15, { align: "center" });
    doc.text("KECAMATAN BALAPULANG", 105, 22, { align: "center" });
    doc.setFontSize(16);
    doc.text("KANTOR KEPALA DESA DIGITAL", 105, 30, { align: "center" });
    
    doc.setLineWidth(0.8);
    doc.line(20, 38, 190, 38);
    doc.setLineWidth(0.2);
    doc.line(20, 39, 190, 39);

    // 3. Judul
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold", "underline");
    doc.text(`SURAT KETERANGAN: ${item.jenis_surat?.toUpperCase() || 'LAYANAN'}`, pageWidth / 2, 50, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(`Nomor: ${item.id?.substring(0, 8) || 'XXXX'}/KDS/${new Date().getFullYear()}`, pageWidth / 2, 57, { align: "center" });

    doc.setFontSize(11);
    doc.text("Yang bertanda tangan di bawah ini Kepala Desa Digital menerangkan bahwa:", 25, 70);

    // 4. Tabel Data (Dinamis - hanya menambah baris jika data ada)
    const bodyData = [
      ['Nama Lengkap', ':', item.nama || '-'],
      ['NIK', ':', item.nik || '-'],
    ];

    if (item.ttl) bodyData.push(['Tempat, Tgl Lahir', ':', item.ttl]);
    if (item.jenis_kelamin) bodyData.push(['Jenis Kelamin', ':', item.jenis_kelamin]);
    if (item.agama) bodyData.push(['Agama', ':', item.agama]);
    if (item.pekerjaan) bodyData.push(['Pekerjaan', ':', item.pekerjaan]);
    if (item.pendidikan) bodyData.push(['Pendidikan', ':', item.pendidikan]);
    if (item.status_kawin) bodyData.push(['Status Perkawinan', ':', item.status_kawin]);
    if (item.alamat) bodyData.push(['Alamat', ':', item.alamat]);
    if (item.keperluan) bodyData.push(['Keperluan', ':', item.keperluan]);

    autoTable(doc, {
      startY: 75,
      theme: 'plain',
      body: bodyData,
      columnStyles: {
        0: { cellWidth: 45, fontStyle: 'bold' },
        1: { cellWidth: 5 },
        2: { cellWidth: 'auto' }
      },
      styles: { fontSize: 10, cellPadding: 1.5 },
      margin: { left: 30 }
    });

    const finalTableY = (doc as any).lastAutoTable.finalY + 10;
    
    const closingText = "Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya. Atas perhatiannya kami ucapkan terima kasih.";
    doc.text(doc.splitTextToSize(closingText, 160), 25, finalTableY);

    const signY = finalTableY + 25;
    doc.text("Balapulang, " + new Date().toLocaleDateString('id-ID'), 130, signY);
    doc.text("Kepala Desa Digital,", 130, signY + 7);
    doc.setFont("helvetica", "bold");
    doc.text("( ANDRA DEVELOPER )", 130, signY + 30);
    doc.setFontSize(9);
    doc.text("NIP. 19900101 202605 1 003", 130, signY + 35);

    doc.save(`Surat_${item.jenis_surat || 'Dokumen'}_${item.nama || 'Warga'}.pdf`);
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
    const openFile = (path: string) => {
      if (!path) return;
      const { data } = supabase.storage.from('berkas-surat').getPublicUrl(path);
      window.open(data.publicUrl, '_blank');
    };

    const choice = prompt(
      `Pilih berkas ${item.nama}:\n1. KTP\n2. KK\n3. Surat RT\n4. Kartu Sampah\nKetik angka (1-4):`, 
      "1"
    );

    if (choice === "1") item.url_ktp ? openFile(item.url_ktp) : alert("KTP tidak ada");
    else if (choice === "2") item.url_kk ? openFile(item.url_kk) : alert("KK tidak ada");
    else if (choice === "3") item.url_surat_rt ? openFile(item.url_surat_rt) : alert("Surat RT tidak ada");
    else if (choice === "4") item.url_kartu_sampah ? openFile(item.url_kartu_sampah) : alert("Kartu Sampah tidak ada");
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
          <button className="w-full flex items-center justify-between px-5 py-4 bg-white/10 rounded-2xl font-bold text-white border border-white/5 shadow-inner">
            <div className="flex items-center gap-3"><FileText size={18} /> Antrean</div>
            <ChevronRight size={14} className="opacity-50" />
          </button>
          <button onClick={exportToCSV} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/5 rounded-2xl font-bold text-slate-400 hover:text-white transition-all group">
            <FileSpreadsheet size={18} className="group-hover:text-emerald-400" /> Export Data
          </button>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-4 text-slate-500 font-bold hover:text-red-400 mt-auto"><LogOut size={18} /> Logout</button>
      </aside>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6">
          <div>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 mb-2">
              <RefreshCw size={12} className={loading || isSubmitting ? "animate-spin" : ""} /> Realtime Active
            </span>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Dashboard <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">Admin</span></h1>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="relative w-full md:w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={16} />
              <input type="text" placeholder="Cari Nama / NIK..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all"/>
            </div>
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              {['Semua', 'pending', 'ACC'].map((s) => (
                <button key={s} onClick={() => setFilter(s)} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${filter === s ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>{s.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} key={stat.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-sm`}><stat.icon size={24} /></div>
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p><p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p></div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
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
                  [...Array(5)].map((_, i) => (<tr key={i} className="animate-pulse"><td colSpan={4} className="px-8 py-10 bg-slate-50/30"></td></tr>))
                ) : (
                  <AnimatePresence mode='popLayout'>
                    {filteredData.map((item) => (
                      <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} key={item.id} className="hover:bg-blue-50/30 transition-all group">
                        <td className="px-8 py-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black group-hover:bg-blue-600 transition-all">{item.nama?.charAt(0)}</div>
                            <div><p className="font-black text-slate-900 tracking-tight">{item.nama}</p><p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">NIK: {item.nik}</p></div>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <div className="flex flex-col"><span className="text-sm font-black text-blue-600">{item.jenis_surat}</span><span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1"><Calendar size={12} /> {new Date(item.created_at).toLocaleDateString('id-ID')}</span></div>
                        </td>
                        <td className="px-8 py-8">
                          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${item.status === 'ACC' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'ACC' ? 'bg-emerald-500' : 'bg-amber-500'}`} /> {item.status}
                          </span>
                        </td>
                        <td className="px-8 py-8 text-right">
                          <div className="flex gap-2 justify-end">
                            {item.status === 'pending' && (
                              <button disabled={isSubmitting} onClick={() => handleUpdateStatus(item.id, 'ACC')} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><CheckCircle size={18} /></button>
                            )}
                            <button onClick={() => generatePDF(item)} className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all" title="Cetak PDF"><FileDown size={18} /></button>
                            <button onClick={() => downloadBerkas(item)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all" title="Lihat Berkas"><Eye size={18} /></button>
                            <button disabled={isSubmitting} onClick={() => handleDelete(item.id)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
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