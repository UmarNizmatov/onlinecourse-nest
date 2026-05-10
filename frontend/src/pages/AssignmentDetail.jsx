import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAssignment, createSubmission } from '../api';
import { useAuth } from '../context/AuthContext';
import Spinner, { InlineSpinner } from '../components/Spinner';
import { ClipboardList, Upload, Send, CheckCircle, ChevronLeft } from 'lucide-react';
import { toast } from '../components/Toast';

export default function AssignmentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getAssignment(id).then(({ data }) => setAssignment(data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && !file) { toast.error("Matn yoki fayl kiritish zarur"); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('assignmentId', id);
      if (content) fd.append('content', content);
      if (file) fd.append('file', file);
      await createSubmission(fd);
      setSubmitted(true);
      toast.success("Topshiriq muvaffaqiyatli yuborildi!");
    } catch (err) { toast.error(err.response?.data?.message || "Xatolik"); }
    finally { setSubmitting(false); }
  };

  if (loading) return <Spinner />;
  if (!assignment) return <div className="text-center py-20 text-slate-400">Topshiriq topilmadi</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 anim-up">
      <button onClick={() => window.history.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 mb-6 transition-colors cursor-pointer">
        <ChevronLeft size={15} /> Ortga
      </button>

      {/* Assignment info */}
      <div className="card p-6 mb-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 strip-orange rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            <ClipboardList size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 mb-1">{assignment.title}</h1>
            {assignment.description && <p className="text-sm text-slate-600 leading-relaxed">{assignment.description}</p>}
            <div className="mt-3">
              <span className="badge badge-orange">Maksimal ball: {assignment.maxScore || 100}</span>
            </div>
          </div>
        </div>
      </div>

      {user?.role === 'student' ? (
        submitted ? (
          <div className="card p-10 text-center anim-up">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Topshiriq Yuborildi!</h3>
            <p className="text-slate-500 text-sm">O'qituvchi baholashini kuting</p>
          </div>
        ) : (
          <div className="card p-6">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Send size={16} className="text-teal-500" /> Javob Yuborish
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Javob matni</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)}
                  placeholder="Javobingizni shu yerga yozing..." rows={5}
                  className="input resize-none" style={{ height: 'auto' }} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Fayl yuklash (ixtiyoriy)</label>
                <label className="flex items-center gap-3 border-2 border-dashed border-slate-200 hover:border-teal-400 rounded-xl p-4 cursor-pointer transition-colors group">
                  <Upload size={20} className="text-slate-400 group-hover:text-teal-500 shrink-0 transition-colors" />
                  <div>
                    {file
                      ? <p className="text-sm font-medium text-slate-700">{file.name}</p>
                      : <><p className="text-sm text-slate-500">Fayl tanlash uchun bosing</p><p className="text-xs text-slate-400 mt-0.5">PDF, DOC, PNG (max 10MB)</p></>}
                  </div>
                  <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                </label>
              </div>
              <button type="submit" disabled={submitting} className="btn btn-primary w-full" style={{ padding: '0.75rem' }}>
                {submitting ? <InlineSpinner /> : <Send size={15} />}
                {submitting ? 'Yuklanmoqda...' : 'Yuborish'}
              </button>
            </form>
          </div>
        )
      ) : (
        <div className="card p-5 text-center text-sm text-slate-500">Bu sahifa faqat talabalar uchun</div>
      )}
    </div>
  );
}
