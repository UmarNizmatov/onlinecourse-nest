import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getModule, getModuleLessons, getAssignmentsByModule } from '../api';
import Spinner from '../components/Spinner';
import { BookOpen, ChevronRight, PlayCircle, ClipboardList, ChevronLeft, FileText } from 'lucide-react';
import { toast } from '../components/Toast';

export default function ModuleDetail() {
  const { id } = useParams();
  const [mod, setMod] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('lessons');

  useEffect(() => {
    Promise.all([getModule(id), getModuleLessons(id), getAssignmentsByModule(id)])
      .then(([{ data: m }, { data: l }, { data: a }]) => { setMod(m); setLessons(l); setAssignments(a); })
      .catch(() => toast.error("Yuklab bo'lmadi"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!mod) return <div className="text-center py-20 text-slate-400">Bo'lim topilmadi</div>;

  return (
    <div className="anim-up">
      {/* Sub-header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <button onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 transition-colors cursor-pointer mb-3">
            <ChevronLeft size={15} /> Ortga
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 strip-teal rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <BookOpen size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Bo'lim</p>
              <h1 className="text-xl font-bold text-slate-800">{mod.title}</h1>
            </div>
          </div>
          <div className="flex gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><PlayCircle size={12} className="text-teal-500" /> {lessons.length} ta dars</span>
            <span className="flex items-center gap-1.5"><ClipboardList size={12} className="text-orange-500" /> {assignments.length} ta topshiriq</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-5 w-fit gap-0.5">
          {[
            { id: 'lessons', label: `Darslar (${lessons.length})`, icon: PlayCircle },
            { id: 'assignments', label: `Topshiriqlar (${assignments.length})`, icon: ClipboardList },
          ].map(({ id: tid, label, icon: Icon }) => (
            <button key={tid} onClick={() => setTab(tid)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                ${tab === tid ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <Icon size={14} />{label}
            </button>
          ))}
        </div>

        {/* Lessons */}
        {tab === 'lessons' && (
          <div className="anim-up">
            {lessons.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <PlayCircle size={26} className="text-slate-300" />
                </div>
                <p className="font-semibold text-slate-500">Hali darslar qo'shilmagan</p>
              </div>
            ) : (
              <div className="card overflow-hidden">
                {lessons.map((lesson, i) => (
                  <Link key={lesson.id} to={`/lessons/${lesson.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-teal-50 transition-colors border-b border-slate-50 last:border-0 group">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 group-hover:bg-teal-600 flex items-center justify-center shrink-0 transition-colors">
                      <span className="text-xs font-bold text-teal-600 group-hover:text-white transition-colors">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 group-hover:text-teal-700 truncate">{lesson.title}</p>
                      {lesson.videoUrl && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-teal-500 mt-0.5">
                          <PlayCircle size={10} /> Video mavjud
                        </span>
                      )}
                    </div>
                    <ChevronRight size={15} className="text-slate-300 group-hover:text-teal-500 shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Assignments */}
        {tab === 'assignments' && (
          <div className="space-y-3 anim-up">
            {assignments.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <ClipboardList size={26} className="text-slate-300" />
                </div>
                <p className="font-semibold text-slate-500">Hali topshiriqlar qo'shilmagan</p>
              </div>
            ) : assignments.map((a) => (
              <Link key={a.id} to={`/assignments/${a.id}`}
                className="card p-4 flex items-start gap-3 hover:border-teal-300 hover:shadow-sm transition-all group block">
                <div className="w-9 h-9 strip-orange rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <ClipboardList size={15} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-teal-700">{a.title}</p>
                  {a.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{a.description}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="badge badge-orange text-[11px]">{a.maxScore || 100} ball</span>
                  <ChevronRight size={15} className="text-slate-300 group-hover:text-teal-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
