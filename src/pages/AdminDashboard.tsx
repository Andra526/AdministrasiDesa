import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Check, Trash2, Clock } from 'lucide-react';

export const AdminDashboard = () => {
  const [dataSurat, setDataSurat] = useState<any[]>([]);

  // 1. Ambil Data & Aktifkan Realtime
  useEffect(() => {
    fetchSurat();
    const channel = supabase.channel('realtime-surat')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pengajuan_surat' }, () => {
        fetchSurat();
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchSurat = async () => {
    const { data } = await supabase.from('pengajuan_surat').select('*').order('created_at', { ascending: false });
    if (data) setDataSurat(data);
  };

  // 2. Fungsi ACC (Update Status)
  const handleApprove = async (id: string) => {
    await supabase.from('pengajuan_surat').update({ status: 'Selesai' }).eq('id', id);
  };

  // 3. Fungsi Hapus (Delete)
  const handleDelete = async (id: string) => {
    if (confirm("Hapus data ini?")) {
      await supabase.from('pengajuan_surat').delete().eq('id', id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 pt-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-blue-900 uppercase tracking-tighter">Panel Admin</h1>
        <button onClick={() => supabase.auth.signOut()} className="px-6 py-2 bg-red-100 text-red-600 rounded-full font-bold">Log Out</button>
      </div>

      <div className="grid gap-4">
        {dataSurat.map((surat) => (
          <div key={surat.id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${surat.status === 'Selesai' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  {surat.status}
                </span>
                <span className="text-xs text-slate-400 italic">NIK: {surat.nik}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 uppercase">{surat.nama_lengkap}</h3>
              <p className="text-sm text-blue-900 font-semibold">{surat.jenis_surat}</p>
              <p className="text-xs text-slate-500 mt-1">{surat.keperluan}</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleApprove(surat.id)} className="p-3 bg-blue-900 text-white rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-blue-900/10">
                <Check size={20} />
              </button>
              <button onClick={() => handleDelete(surat.id)} className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:text-red-600 transition-all">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};