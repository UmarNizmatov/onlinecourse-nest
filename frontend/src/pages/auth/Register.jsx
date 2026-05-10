import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Eye, EyeOff, UserPlus, BookOpen } from 'lucide-react';
import { InlineSpinner } from '../../components/Spinner';
import { toast } from '../../components/Toast';

const ROLES = [
  { value: 'student', label: 'Talaba', icon: GraduationCap, desc: 'Kurslarga yoziling va o\'rganing' },
  { value: 'teacher', label: "O'qituvchi", icon: BookOpen, desc: 'Kurslar yarating va o\'qiting' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password.length < 6) { setError("Parol kamida 6 belgidan iborat bo'lishi kerak"); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success("Ro'yxatdan muvaffaqiyatli o'tdingiz!");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Ro'yxatdan o'tishda xatolik");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100dvh-64px)] flex items-center justify-center p-4 sm:p-8 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 hero-gradient rounded-2xl mb-3 shadow-md">
            <GraduationCap size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Hisob Yaratish</h1>
          <p className="text-slate-500 text-sm mt-1">EduPortal oilasiga qo'shiling</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7 anim-up">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Rol tanlang</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(({ value, label, icon: Icon, desc }) => (
                  <button key={value} type="button" onClick={() => setForm({ ...form, role: value })}
                    className={`relative flex flex-col items-start gap-1 p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer
                      ${form.role === value ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'}`}>
                    <Icon size={18} className={form.role === value ? 'text-teal-600' : 'text-slate-400'} />
                    <span className={`text-sm font-semibold ${form.role === value ? 'text-teal-700' : 'text-slate-700'}`}>{label}</span>
                    <span className="text-[11px] text-slate-400 leading-tight">{desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="name">To'liq ism</label>
              <input id="name" type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ism Familiya" autoComplete="name"
                className="input" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="reg-email">Email</label>
              <input id="reg-email" type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com" autoComplete="email"
                className="input" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="reg-pass">Parol</label>
              <div className="relative">
                <input id="reg-pass" type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Kamida 6 belgi" autoComplete="new-password"
                  className="input pr-11" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full" style={{ padding: '0.75rem 1.25rem' }}>
              {loading ? <InlineSpinner /> : <UserPlus size={16} />}
              {loading ? "Yuklanmoqda..." : "Ro'yxatdan O'tish"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Hisobingiz bormi?{' '}
            <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700">Kirish</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
