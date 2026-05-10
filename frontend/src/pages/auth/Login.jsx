import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Eye, EyeOff, LogIn } from 'lucide-react';
import { InlineSpinner } from '../../components/Spinner';
import { toast } from '../../components/Toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success("Tizimga muvaffaqiyatli kirdingiz!");
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'teacher') navigate('/teacher');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Email yoki parol noto'g'ri");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100dvh-64px)] flex">
      {/* Left panel (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative overflow-hidden flex-col items-center justify-center p-12 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute bottom-10 -left-10 w-60 h-60 rounded-full bg-white/5" />
        </div>
        <div className="relative text-center max-w-sm">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg backdrop-blur-sm">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-extrabold mb-3">EduPortal</h2>
          <p className="text-teal-100 leading-relaxed">
            O'zbek tilida eng yaxshi online ta'lim platformasiga xush kelibsiz
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[['100+', 'Kurslar'], ['5K+', 'Talabalar'], ['50+', "O'qituvchilar"]].map(([v, l]) => (
              <div key={l} className="bg-white/10 rounded-2xl py-3 px-2 backdrop-blur-sm">
                <p className="text-xl font-bold">{v}</p>
                <p className="text-xs text-teal-200 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-slate-50">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 hero-gradient rounded-2xl mb-3 shadow-md">
              <GraduationCap size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">EduPortal</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7 anim-up">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Xush kelibsiz!</h2>
              <p className="text-slate-500 text-sm mt-1">Hisobingizga kiring</p>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="email">Email</label>
                <input id="email" type="email" autoComplete="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                  className="input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="password">Parol</label>
                <div className="relative">
                  <input id="password" type={showPass ? 'text' : 'password'} autoComplete="current-password"
                    required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="input pr-11" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2" style={{ padding: '0.75rem 1.25rem' }}>
                {loading ? <InlineSpinner /> : <LogIn size={16} />}
                {loading ? 'Kirish...' : 'Kirish'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-5">
              Hisobingiz yo'qmi?{' '}
              <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-700">Ro'yxatdan o'ting</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
