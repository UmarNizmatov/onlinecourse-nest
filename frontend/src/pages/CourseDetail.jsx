import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourse, getCourseModules, enroll, getMyEnrollments } from '../api';
import { useAuth } from '../context/AuthContext';
import Spinner, { InlineSpinner } from '../components/Spinner';
import { BookOpen, ChevronRight, Layers, Award, Tag, GraduationCap, CheckCircle, ChevronLeft, Lock } from 'lucide-react';
import { toast } from '../components/Toast';

const LEVELS = { beginner: "Boshlang'ich", intermediate: "O'rta", advanced: "Ilg'or" };

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: c }, { data: m }] = await Promise.all([getCourse(id), getCourseModules(id)]);
        setCourse(c); setModules(m);
        if (user?.role === 'student') {
          const { data: enrollments } = await getMyEnrollments();
          setEnrolled(enrollments.some((e) => e.course?.id === id || e.courseId === id));
        }
      } catch { toast.error("Yuklab bo'lmadi"); }
      finally { setLoading(false); }
    };
    load();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    setEnrolling(true);
    try {
      await enroll(id); setEnrolled(true);
      toast.success("Kursga muvaffaqiyatli yozildingiz!");
    } catch (err) { toast.error(err.response?.data?.message || "Xatolik"); }
    finally { setEnrolling(false); }
  };

  if (loading) return <Spinner />;
  if (!course) return <div className="text-center py-20 text-slate-400">Kurs topilmadi</div>;

  return (
    <div className="anim-up">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-slate-500">
            <Link to="/courses" className="hover:text-teal-600 transition-colors flex items-center gap-1">
              <ChevronLeft size={14} /> Kurslar
            </Link>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-700 font-medium truncate">{course.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            {/* Course info card */}
            <div className="card">
              <div className="h-3 hero-gradient" />
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="badge badge-teal"><Tag size={10} /> {course.category || 'Umumiy'}</span>
                  <span className="badge badge-amber"><GraduationCap size={10} /> {LEVELS[course.level] || course.level}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">{course.name}</h1>
                <p className="text-slate-600 leading-relaxed">{course.description}</p>
              </div>
            </div>

            {/* Modules */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 strip-teal rounded-xl flex items-center justify-center shadow-sm">
                  <Layers size={15} className="text-white" />
                </div>
                <h2 className="font-bold text-slate-800">Kurs Dasturi</h2>
                <span className="badge badge-teal ml-auto">{modules.length} bo'lim</span>
              </div>

              {modules.length === 0 ? (
                <div className="card p-10 text-center">
                  <BookOpen size={36} className="mx-auto text-slate-200 mb-3" />
                  <p className="text-slate-400 font-medium">Hali bo'limlar qo'shilmagan</p>
                </div>
              ) : (
                <div className="card overflow-hidden">
                  {modules.map((mod, i) => (
                    <Link key={mod.id} to={`/modules/${mod.id}`}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-teal-50 transition-colors border-b border-slate-50 last:border-0 group">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        {i + 1}
                      </div>
                      <span className="flex-1 text-sm font-medium text-slate-700 group-hover:text-teal-700">{mod.title}</span>
                      <ChevronRight size={15} className="text-slate-300 group-hover:text-teal-500 shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="card sticky top-16 p-5">
              <div className="text-center pb-4 border-b border-slate-100 mb-4">
                <p className={`text-3xl font-extrabold ${course.price == 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {course.price == 0 ? "Bepul" : `${Number(course.price).toLocaleString()} so'm`}
                </p>
              </div>

              {user?.role === 'student' ? (
                enrolled ? (
                  <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 py-3 rounded-xl font-semibold text-sm mb-4">
                    <CheckCircle size={16} /> Kursga yozilgansiz
                  </div>
                ) : (
                  <button onClick={handleEnroll} disabled={enrolling}
                    className="btn btn-primary w-full mb-4" style={{ padding: '0.875rem' }}>
                    {enrolling ? <InlineSpinner /> : null}
                    {enrolling ? 'Yuklanmoqda...' : 'Kursga Yozilish'}
                  </button>
                )
              ) : !user ? (
                <Link to="/login" className="btn btn-primary w-full mb-4 text-center" style={{ padding: '0.875rem' }}>
                  <Lock size={15} /> Kirish va Yozilish
                </Link>
              ) : null}

              <ul className="space-y-2.5">
                {[
                  [`${modules.length} ta bo'lim`, Layers],
                  ['Sertifikat beriladi', Award],
                  ['Istalgan qurilmada', CheckCircle],
                ].map(([text, Icon]) => (
                  <li key={text} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <Icon size={15} className="text-teal-500 shrink-0" /> {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
