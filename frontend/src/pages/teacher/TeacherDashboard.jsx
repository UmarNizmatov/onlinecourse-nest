import { useState, useEffect } from 'react';
import { getModules, getLessons, getAssignments, getSubmissions, checkSubmission, createModule, createLesson, createAssignment, getCourses } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Spinner, { InlineSpinner } from '../../components/Spinner';
import Modal from '../../components/Modal';
import { toast } from '../../components/Toast';
import { BookOpen, PlayCircle, ClipboardList, CheckCircle, Plus, Clock, Star, LayoutGrid } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [checkTarget, setCheckTarget] = useState(null);

  const [moduleForm, setModuleForm] = useState({ title: '', courseId: '' });
  const [lessonForm, setLessonForm] = useState({ title: '', content: '', moduleId: '' });
  const [lessonFile, setLessonFile] = useState(null);
  const [assignForm, setAssignForm] = useState({ title: '', description: '', maxScore: 100, moduleId: '' });
  const [checkScore, setCheckScore] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [{ data: m }, { data: l }, { data: a }, { data: s }, { data: c }] = await Promise.all([
        getModules(), getLessons(), getAssignments(), getSubmissions(), getCourses(),
      ]);
      setModules(m); setLessons(l); setAssignments(a); setSubmissions(s); setCourses(c);
    } catch { toast.error("Yuklab bo'lmadi"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const pending = submissions.filter((s) => s.status === 'pending');

  const save = async (fn, onDone) => {
    setSaving(true);
    try { await fn(); onDone(); load(); }
    catch (err) { toast.error(err.response?.data?.message || "Xatolik"); }
    finally { setSaving(false); }
  };

  if (loading) return <Spinner />;

  const tabs = [
    { id: 'overview',     label: "Ko'rinish",       icon: LayoutGrid,     count: null },
    { id: 'modules',      label: "Bo'limlar",        icon: BookOpen,       count: modules.length },
    { id: 'lessons',      label: 'Darslar',          icon: PlayCircle,     count: lessons.length },
    { id: 'assignments',  label: 'Topshiriqlar',     icon: ClipboardList,  count: assignments.length },
    { id: 'submissions',  label: 'Javoblar',         icon: CheckCircle,    count: pending.length, badge: pending.length > 0 },
  ];

  const INPUT_CLS = 'input';
  const SELECT_CLS = 'input bg-white';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 anim-up">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">O'qituvchi Paneli</h1>
          <p className="text-slate-500 text-sm mt-0.5">Xush kelibsiz, <span className="text-teal-600 font-medium">{user?.name}</span></p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowModuleModal(true)} className="btn btn-primary btn-sm">
            <Plus size={14} /> Bo'lim
          </button>
          <button onClick={() => setShowLessonModal(true)} className="btn btn-secondary btn-sm">
            <Plus size={14} /> Dars
          </button>
          <button onClick={() => setShowAssignModal(true)} className="btn btn-secondary btn-sm">
            <Plus size={14} /> Topshiriq
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon, count, badge }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer
              ${tab === id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <Icon size={14} />
            {label}
            {count !== null && (
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${badge ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 anim-up">
          {[
            { label: "Bo'limlar",    value: modules.length,    grad: 'strip-teal',   Icon: BookOpen },
            { label: 'Darslar',      value: lessons.length,    grad: 'strip-purple', Icon: PlayCircle },
            { label: 'Topshiriqlar', value: assignments.length, grad: 'strip-orange', Icon: ClipboardList },
            { label: 'Kutilayapti',  value: pending.length,    grad: 'strip-green',  Icon: Clock },
          ].map(({ label, value, grad, Icon }) => (
            <div key={label} className="card p-5 flex items-center gap-3 hover:shadow-md transition-shadow">
              <div className={`w-11 h-11 ${grad} rounded-2xl flex items-center justify-center shadow-sm shrink-0`}>
                <Icon size={19} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modules */}
      {tab === 'modules' && (
        <div className="anim-up">
          {modules.length === 0 ? (
            <EmptyState icon={BookOpen} text="Hali bo'limlar yo'q" />
          ) : (
            <div className="card overflow-hidden">
              {modules.map((m, i) => (
                <div key={m.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <div className="w-7 h-7 bg-teal-50 text-teal-600 text-xs font-bold rounded-lg flex items-center justify-center">{i + 1}</div>
                  <span className="flex-1 text-sm font-medium text-slate-700">{m.title}</span>
                  {m.course?.name && <span className="badge badge-teal text-[11px]">{m.course.name}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lessons */}
      {tab === 'lessons' && (
        <div className="anim-up">
          {lessons.length === 0 ? (
            <EmptyState icon={PlayCircle} text="Hali darslar yo'q" />
          ) : (
            <div className="card overflow-hidden">
              {lessons.map((l) => (
                <div key={l.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 strip-teal rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <PlayCircle size={15} className="text-white" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-slate-700">{l.title}</span>
                  {l.videoUrl && <span className="badge badge-teal text-[11px]">Video</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Assignments */}
      {tab === 'assignments' && (
        <div className="anim-up">
          {assignments.length === 0 ? (
            <EmptyState icon={ClipboardList} text="Hali topshiriqlar yo'q" />
          ) : (
            <div className="card overflow-hidden">
              {assignments.map((a) => (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 strip-orange rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <ClipboardList size={15} className="text-white" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-slate-700">{a.title}</span>
                  <span className="badge badge-orange text-[11px]">Max: {a.maxScore}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Submissions */}
      {tab === 'submissions' && (
        <div className="space-y-3 anim-up">
          {submissions.length === 0 ? (
            <EmptyState icon={CheckCircle} text="Hali javoblar yo'q" />
          ) : submissions.map((s) => (
            <div key={s.id} className="card p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {s.user?.name?.[0]?.toUpperCase() || 'T'}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{s.user?.name || 'Talaba'}</span>
                </div>
                {s.content && <p className="text-xs text-slate-500 line-clamp-2 mb-2 ml-9">{s.content}</p>}
                <div className="ml-9">
                  {s.status === 'checked'
                    ? <span className="badge badge-green text-[11px]"><CheckCircle size={10} /> Baholangan — {s.score} ball</span>
                    : <span className="badge badge-amber text-[11px]"><Clock size={10} /> Kutilayapti</span>}
                </div>
              </div>
              {s.status === 'pending' && (
                <button onClick={() => { setCheckTarget(s); setCheckScore(''); }}
                  className="btn btn-sm strip-teal text-white hover:opacity-90 shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0D9488, #06b6d4)' }}>
                  <Star size={12} /> Baholash
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Module */}
      {showModuleModal && (
        <Modal title="Yangi Bo'lim" onClose={() => setShowModuleModal(false)}>
          <form onSubmit={(e) => { e.preventDefault(); save(() => createModule(moduleForm), () => { setShowModuleModal(false); setModuleForm({ title: '', courseId: '' }); }); }} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bo'lim nomi *</label>
              <input type="text" required value={moduleForm.title} onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })} placeholder="Masalan: JavaScript asoslari" className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kurs *</label>
              <select required value={moduleForm.courseId} onChange={(e) => setModuleForm({ ...moduleForm, courseId: e.target.value })} className={SELECT_CLS}>
                <option value="">Kurs tanlang</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <ModalFooter onCancel={() => setShowModuleModal(false)} saving={saving} />
          </form>
        </Modal>
      )}

      {/* Modal: Create Lesson */}
      {showLessonModal && (
        <Modal title="Yangi Dars" onClose={() => setShowLessonModal(false)} wide>
          <form onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData();
            fd.append('title', lessonForm.title);
            fd.append('content', lessonForm.content);
            fd.append('moduleId', lessonForm.moduleId);
            if (lessonFile) fd.append('video', lessonFile);
            save(() => createLesson(fd), () => { setShowLessonModal(false); setLessonForm({ title: '', content: '', moduleId: '' }); setLessonFile(null); });
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Dars nomi *</label>
              <input type="text" required value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} placeholder="Dars nomi" className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bo'lim *</label>
              <select required value={lessonForm.moduleId} onChange={(e) => setLessonForm({ ...lessonForm, moduleId: e.target.value })} className={SELECT_CLS}>
                <option value="">Bo'lim tanlang</option>
                {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kontent</label>
              <textarea value={lessonForm.content} onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })} rows={4} placeholder="Dars matni..." className={INPUT_CLS + ' resize-none'} style={{ height: 'auto' }} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Video fayl</label>
              <label className="flex items-center gap-3 border-2 border-dashed border-slate-200 hover:border-teal-400 rounded-xl p-3.5 cursor-pointer transition-colors group">
                <PlayCircle size={18} className="text-slate-400 group-hover:text-teal-500 transition-colors" />
                <span className="text-sm text-slate-500 group-hover:text-teal-600 transition-colors">
                  {lessonFile ? lessonFile.name : 'Video tanlash (ixtiyoriy)'}
                </span>
                <input type="file" accept="video/*" className="hidden" onChange={(e) => setLessonFile(e.target.files[0])} />
              </label>
            </div>
            <ModalFooter onCancel={() => setShowLessonModal(false)} saving={saving} />
          </form>
        </Modal>
      )}

      {/* Modal: Create Assignment */}
      {showAssignModal && (
        <Modal title="Yangi Topshiriq" onClose={() => setShowAssignModal(false)}>
          <form onSubmit={(e) => {
            e.preventDefault();
            save(() => createAssignment(assignForm.moduleId, { title: assignForm.title, description: assignForm.description, maxScore: Number(assignForm.maxScore) }),
              () => { setShowAssignModal(false); setAssignForm({ title: '', description: '', maxScore: 100, moduleId: '' }); });
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Topshiriq nomi *</label>
              <input type="text" required value={assignForm.title} onChange={(e) => setAssignForm({ ...assignForm, title: e.target.value })} placeholder="Topshiriq nomi" className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bo'lim *</label>
              <select required value={assignForm.moduleId} onChange={(e) => setAssignForm({ ...assignForm, moduleId: e.target.value })} className={SELECT_CLS}>
                <option value="">Bo'lim tanlang</option>
                {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tavsif</label>
              <textarea value={assignForm.description} onChange={(e) => setAssignForm({ ...assignForm, description: e.target.value })} rows={3} placeholder="Topshiriq tavsifi..." className={INPUT_CLS + ' resize-none'} style={{ height: 'auto' }} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Maksimal ball</label>
              <input type="number" min="1" value={assignForm.maxScore} onChange={(e) => setAssignForm({ ...assignForm, maxScore: e.target.value })} className={INPUT_CLS} />
            </div>
            <ModalFooter onCancel={() => setShowAssignModal(false)} saving={saving} />
          </form>
        </Modal>
      )}

      {/* Modal: Check submission */}
      {checkTarget && (
        <Modal title="Topshiriqni Baholash" onClose={() => setCheckTarget(null)}>
          <div className="mb-4 p-4 bg-slate-50 rounded-xl">
            <p className="text-sm font-semibold text-slate-700 mb-1">{checkTarget.user?.name || 'Talaba'}</p>
            {checkTarget.content && <p className="text-sm text-slate-600 leading-relaxed">{checkTarget.content}</p>}
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            save(() => checkSubmission(checkTarget.id, { score: Number(checkScore) }), () => { setCheckTarget(null); setCheckScore(''); });
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ball (0 — {checkTarget.assignment?.maxScore || 100})</label>
              <input type="number" required min="0" max={checkTarget.assignment?.maxScore || 100} value={checkScore} onChange={(e) => setCheckScore(e.target.value)} placeholder="Ball kiriting" className={INPUT_CLS} />
            </div>
            <ModalFooter onCancel={() => setCheckTarget(null)} saving={saving} confirmText="Baholash" />
          </form>
        </Modal>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="card p-12 text-center">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <Icon size={26} className="text-slate-300" />
      </div>
      <p className="font-semibold text-slate-400">{text}</p>
    </div>
  );
}

function ModalFooter({ onCancel, saving, confirmText = 'Saqlash' }) {
  return (
    <div className="flex gap-3 pt-1">
      <button type="button" onClick={onCancel} className="btn btn-ghost flex-1 border border-slate-200">Bekor qilish</button>
      <button type="submit" disabled={saving} className="btn btn-primary flex-1">
        {saving ? <InlineSpinner /> : null}
        {saving ? 'Saqlanmoqda...' : confirmText}
      </button>
    </div>
  );
}
