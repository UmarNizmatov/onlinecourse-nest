import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogOut, ChevronDown, Menu, X, Bell } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navLinks = user
    ? user.role === 'admin'
      ? [{ to: '/admin', label: 'Boshqaruv' }, { to: '/courses', label: 'Kurslar' }]
      : user.role === 'teacher'
      ? [{ to: '/teacher', label: 'Darslarim' }, { to: '/courses', label: 'Kurslar' }]
      : [{ to: '/dashboard', label: 'Panel' }, { to: '/courses', label: 'Kurslar' }, { to: '/results', label: 'Natijalar' }]
    : [{ to: '/courses', label: 'Kurslar' }];

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

  const roleLabel = user?.role === 'admin' ? 'Administrator' : user?.role === 'teacher' ? "O'qituvchi" : 'Talaba';
  const roleDot = user?.role === 'admin' ? 'bg-purple-500' : user?.role === 'teacher' ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <>
      <nav className="sticky top-0 z-50 h-16 bg-white/95 backdrop-blur-lg border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="EduPortal bosh sahifasi">
            <div className="w-8 h-8 hero-gradient rounded-xl flex items-center justify-center shadow-sm">
              <GraduationCap size={17} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">Edu<span className="gradient-text">Portal</span></span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150
                  ${isActive(l.to) ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {user ? (
              <div ref={dropRef} className="relative">
                <button onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${roleDot} rounded-full border-2 border-white`} />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-none">{user.name?.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{roleLabel}</p>
                  </div>
                  <ChevronDown size={13} className={`text-slate-400 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden anim-scale">
                    <div className="px-4 py-3 bg-gradient-to-br from-teal-50 to-cyan-50 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-1.5">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer font-medium">
                        <LogOut size={15} /> Chiqish
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost btn-sm">Kirish</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Ro'yxat</Link>
              </div>
            )}

            {/* Mobile burger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Menyu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 md:hidden anim-in" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 md:hidden shadow-2xl anim-slide flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <span className="font-bold text-slate-800">Menyu</span>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"><X size={18} /></button>
            </div>
            {user && (
              <div className="mx-4 mt-4 p-3 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">{user.name}</p>
                  <p className="text-xs text-slate-500">{roleLabel}</p>
                </div>
              </div>
            )}
            <div className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                    ${isActive(l.to) ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100">
              {user ? (
                <button onClick={handleLogout} className="btn btn-danger w-full">
                  <LogOut size={15} /> Chiqish
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" className="btn btn-secondary text-center">Kirish</Link>
                  <Link to="/register" className="btn btn-primary text-center">Ro'yxat</Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
