import { useState, useEffect } from 'react';
import { getMyResults } from '../../api';
import Spinner from '../../components/Spinner';
import { Award, TrendingUp, Trophy } from 'lucide-react';

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyResults().then(({ data }) => setResults(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  const avg = results.length ? Math.round(results.reduce((s, r) => s + (r.totalScore || 0), 0) / results.length) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 anim-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Trophy size={24} className="text-orange-500" /> Mening Natijalarim
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Barcha kurslar bo'yicha natijalaringiz</p>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { icon: Award, label: 'Baholangan kurslar', value: results.length, grad: 'strip-teal' },
            { icon: TrendingUp, label: "O'rtacha ball", value: avg, grad: 'strip-orange' },
          ].map(({ icon: Icon, label, value, grad }) => (
            <div key={label} className="card p-5 flex items-center gap-3">
              <div className={`w-11 h-11 ${grad} rounded-2xl flex items-center justify-center shadow-sm`}>
                <Icon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 ? (
        <div className="card p-14 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy size={28} className="text-slate-300" />
          </div>
          <p className="font-semibold text-slate-500 mb-1">Hali natijalar yo'q</p>
          <p className="text-slate-400 text-sm">Kurslarda qatnashing va baholaringizni ko'ring</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700 text-sm">Batafsil natijalar</h2>
          </div>
          <table className="w-full table-auto table-styled">
            <thead><tr><th>Kurs</th><th>Daraja</th><th className="text-right">Ball</th></tr></thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.course?.name || 'Kurs'}</td>
                  <td className="text-slate-400 text-xs">{r.course?.category || '—'}</td>
                  <td>
                    <div className="flex justify-end">
                      <span className={`badge font-bold ${r.totalScore >= 80 ? 'badge-green' : r.totalScore >= 60 ? 'badge-amber' : 'badge-red'}`}>
                        <Award size={11} /> {r.totalScore} ball
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
