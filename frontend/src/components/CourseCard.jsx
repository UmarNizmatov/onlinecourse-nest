import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, BarChart2 } from 'lucide-react';

const LEVELS = {
  beginner:     { label: "Boshlang'ich", class: 'badge-green' },
  intermediate: { label: "O'rta",        class: 'badge-amber' },
  advanced:     { label: "Ilg'or",       class: 'badge-red'   },
};

const GRADIENTS = [
  'from-teal-500 to-cyan-500',
  'from-indigo-500 to-purple-600',
  'from-orange-400 to-rose-500',
  'from-emerald-500 to-teal-600',
  'from-sky-500 to-blue-600',
  'from-violet-500 to-purple-600',
];

export default function CourseCard({ course, index = 0 }) {
  const grad = GRADIENTS[index % GRADIENTS.length];
  const lvl = LEVELS[course.level] || LEVELS.beginner;

  return (
    <div className="card card-lift group flex flex-col h-full">
      {/* Top gradient banner */}
      <div className={`h-28 bg-gradient-to-br ${grad} relative overflow-hidden flex-shrink-0`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/30" />
          <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-white/20" />
        </div>
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <span className="badge badge-teal bg-white/20 border-white/30 text-white text-[11px]">
            {course.category || 'Umumiy'}
          </span>
          <span className={`badge ${lvl.class} bg-white/20 border-white/30 text-white text-[11px]`}>
            {lvl.label}
          </span>
        </div>
        <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
          <BookOpen size={16} className="text-white" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-teal-700 transition-colors">
          {course.name}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1 mb-4">
          {course.description || "Kurs haqida ma'lumot mavjud emas."}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <p className={`text-sm font-bold ${course.price === 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
              {course.price === 0 ? "Bepul" : `${Number(course.price).toLocaleString()} so'm`}
            </p>
          </div>
          <Link to={`/courses/${course.id}`}
            className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors group/btn">
            Ko'rish
            <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
