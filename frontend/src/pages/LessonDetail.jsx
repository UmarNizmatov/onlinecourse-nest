import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLesson } from '../api';
import Spinner from '../components/Spinner';
import { PlayCircle, FileText, ChevronLeft } from 'lucide-react';

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLesson(id).then(({ data }) => setLesson(data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!lesson) return <div className="text-center py-20 text-slate-400">Dars topilmadi</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 anim-up">
      <button onClick={() => window.history.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 mb-6 transition-colors cursor-pointer">
        <ChevronLeft size={15} /> Ortga
      </button>

      <div className="card overflow-hidden">
        {/* Video */}
        {lesson.videoUrl && (
          <div className="aspect-video bg-slate-900 w-full">
            <video src={lesson.videoUrl} controls className="w-full h-full" aria-label={lesson.title}>
              <track kind="captions" />
            </video>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 strip-teal rounded-xl flex items-center justify-center shadow-sm">
              <PlayCircle size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">{lesson.title}</h1>
          </div>

          {lesson.content ? (
            <p className="text-slate-600 leading-loose text-sm whitespace-pre-wrap">{lesson.content}</p>
          ) : (
            <div className="flex items-center justify-center gap-2 py-10 text-slate-300">
              <FileText size={20} />
              <span className="text-sm">Qo'shimcha kontent mavjud emas</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
