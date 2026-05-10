import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyEnrollments, getMyResults } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';
import { BookOpen, Award, TrendingUp, ChevronRight, GraduationCap, ArrowRight, Trophy } from 'lucide-react';

const GRADIENTS = ['from-teal-500 to-cyan-500', 'from-indigo-500 to-purple-500', 'from-orange-400 to-rose-500', 'from-emerald-500 to-teal-600'];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyEnrollments(), getMyResults()])
      .then(([{ data: e }, { data: r }]) => { setEnrollments(e); setResults(r); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  const avg = results.length ? Math.round(results.reduce((s, r) => s + (r.totalScore || 0), 0) / results.length) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 anim-up">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Xush kelibsiz, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>! 👋
        </h1>
        <p className="text-slate-500 mt-1 text-sm">O'quv jarayoningizni davom ettiring</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: BookOpen, label: 'Kurslar', value: enrollments.length, grad: 'strip-teal', sub: "ta kursga yozilgan" },
          { icon: Award, label: 'Natijalar', value: results.length, grad: 'strip-orange', sub: "ta kurs baholangan" },
          { icon: TrendingUp, label: "O'rtacha Ball", value: avg, grad: 'strip-purple', sub: "umumiy o'rtacha" },
        ].map(({ icon: Icon, label, value, grad, sub }) => (
          <div key={label} className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${grad} rounded-2xl flex items-center justify-center shadow-sm shrink-0`}>
              <Icon size={22} className="text-white" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-800 leading-none">{value}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">{label}</p>
              <p className="text-[11px] text-slate-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Enrolled courses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800 text-lg">Mening Kurslarim</h2>
          <Link to="/courses" className="btn btn-secondary btn-sm"><ArrowRight size={14} /> Yangi kurslar</Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={28} className="text-teal-400" />
            </div>
            <p className="font-semibold text-slate-600 mb-1">Hali kurslar yo'q</p>
            <p className="text-slate-400 text-sm mb-4">O'zingizga mos kurs topib yoziling</p>
            <Link to="/courses" className="btn btn-primary btn-sm">Kurslarni Ko'rish <ArrowRight size={14} /></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((e, i) => (
              <Link key={e.id} to={`/courses/${e.course?.id}`}
                className="card card-lift p-0 overflow-hidden group block">
                <div className={`h-1.5 bg-gradient-to-r ${GRADIENTS[i % GRADIENTS.length]}`} />
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors line-clamp-2 text-sm mb-2">
                    {e.course?.name || 'Kurs'}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="badge badge-teal text-[11px]">{e.course?.category || 'Umumiy'}</span>
                    <ChevronRight size={15} className="text-slate-300 group-hover:text-teal-500 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Results table */}
      {results.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Trophy size={18} className="text-orange-500" /> Natijalar
            </h2>
            <Link to="/results" className="btn btn-ghost btn-sm text-teal-600">Batafsil <ChevronRight size={14} /></Link>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full table-auto table-styled">
              <thead>
                <tr><th>Kurs</th><th className="text-right">Ball</th></tr>
              </thead>
              <tbody>
                {results.slice(0, 5).map((r) => (
                  <tr key={r.id}>
                    <td>{r.course?.name || 'Kurs'}</td>
                    <td>
                      <div className="flex justify-end">
                        <span className={`badge ${r.totalScore >= 80 ? 'badge-green' : r.totalScore >= 60 ? 'badge-amber' : 'badge-red'}`}>
                          <Award size={11} /> {r.totalScore}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
