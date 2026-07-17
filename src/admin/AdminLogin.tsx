import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminLogin() {
  const { loginAdmin, isAdminAuth } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAdminAuth) {
    const from = (location.state as { from?: string })?.from || '/admin';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const ok = loginAdmin(email, password);
      setLoading(false);
      if (ok) {
        const from = (location.state as { from?: string })?.from || '/admin';
        navigate(from, { replace: true });
      } else {
        setError('Email ou mot de passe incorrect.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] dark:bg-surface-dark px-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary-500/20">
            <span className="text-white font-black text-xl">A</span>
          </div>
          <h1 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">AZOURA Admin</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Connectez-vous pour accéder au tableau de bord</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-2xl p-5 space-y-3.5 shadow-sm">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose/10 text-rose text-[12px] font-medium">
              <AlertCircle size={14} className="shrink-0" /> {error}
            </div>
          )}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@azoura.ma"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg text-[13px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Mot de passe</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2.5 rounded-lg text-[13px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg text-[13px] font-bold bg-primary-500 text-white hover:bg-primary-600 shadow-sm transition-all disabled:opacity-60">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          <p className="text-center text-[10px] text-gray-400 pt-1">Démo — admin@azoura.ma / azoura2026</p>
        </form>
      </motion.div>
    </div>
  );
}
