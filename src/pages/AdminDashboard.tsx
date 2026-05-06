import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { LogIn, Lock, Mail } from 'lucide-react';

export const AdminDashboard = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Cek apakah admin sudah login saat halaman dibuka
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // 1. Tampilan Form Login jika Belum Autentikasi
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl shadow-blue-900/10 border border-slate-50"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-blue-900 tracking-tighter uppercase">Admin Login</h2>
            <p className="text-slate-400 text-xs font-bold tracking-widest mt-1">Desa Digital Balapulang</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" 
                placeholder="Email Admin" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 transition-all font-medium"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 transition-all font-medium"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              disabled={loading}
              className="w-full py-4 bg-blue-900 text-white rounded-2xl font-bold shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={18} /> {loading ? 'Checking...' : 'Masuk Dashboard'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // 2. Tampilan Dashboard Utama jika Sudah Login (Gunakan kode dashboard sebelumnya di sini)
  return (
    <div className="min-h-screen bg-slate-50 p-6 pt-28">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-blue-900 uppercase">Panel Admin</h1>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
          >
            Log Out
          </button>
        </div>
        
        {/* Isi grid kartu pengajuan surat Anda di sini */}
        
      </div>
    </div>
  );
};