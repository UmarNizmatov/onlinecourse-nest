import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCourses } from '../api';
import CourseCard from '../components/CourseCard';
import { GraduationCap, BookOpen, Users, Award, ArrowRight, Star, PlayCircle, CheckCircle, Zap } from 'lucide-react';

const FEATURES = [
  { icon: PlayCircle,    title: 'Video Darslar',    desc: 'HD sifatida yozilgan darslar istalgan vaqtda mavjud', color: 'strip-teal' },
  { icon: Award,         title: 'Sertifikatlar',    desc: "Kursni tugatgandan so'ng rasmiy sertifikat oling",    color: 'strip-orange' },
  { icon: Zap,           title: 'Tezkor O\'rganish', desc: 'Strukturalangan dastur bilan tez o\'rganib oling',    color: 'strip-purple' },
];

export default function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses().then(({ data }) => setCourses(data.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute top-16 -left-20 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-white/5" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Star size={14} className="fill-yellow-300 text-yellow-300" />
              O'zbekistondagi #1 Online Ta'lim Platformasi
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight mb-5">
              Kelajagingizni
              <span className="block text-cyan-200 mt-1">Bugun Boshqaring</span>
            </h1>
            <p className="text-teal-100 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              100+ kurs, tajribali o'qituvchilar va sertifikatlar bilan o'z sohangizdagi
              mutaxassis bo'ling.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link to="/courses" className="btn btn-lg bg-white text-teal-700 hover:bg-teal-50 shadow-lg font-bold">
                Kurslarni Ko'rish <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-lg bg-white/15 border border-white/25 text-white hover:bg-white/25 backdrop-blur-sm font-medium">
                Bepul Ro'yxatdan O'tish
              </Link>
            </div>

            {/* Mini stats */}
            <div className="flex items-center justify-center gap-6 sm:gap-10">
              {[['100+', 'Kurslar'], ['5K+', 'Talabalar'], ['50+', "O'qituvchilar"]].map(([val, label]) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-extrabold text-white">{val}</p>
                  <p className="text-xs text-teal-200 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Nima uchun EduPortal?</h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">Zamonaviy ta'limning barcha imkoniyatlari bitta joyda</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="group p-6 rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all duration-200 cursor-default">
                <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1.5">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      {courses.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-1">Mashhur kurslar</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Hozir Trend Bo'lgan Kurslar</h2>
            </div>
            <Link to="/courses" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors group">
              Barchasini Ko'rish
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
          </div>
          <div className="sm:hidden mt-6 text-center">
            <Link to="/courses" className="btn btn-secondary">Barcha kurslar <ArrowRight size={15} /></Link>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-sm px-3 py-1 rounded-full mb-5">
            <CheckCircle size={13} className="text-emerald-300" />
            Bugun birinchi qadam tashlang
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">O'rganishni Boshlang!</h2>
          <p className="text-teal-100 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Minglab talabalar allaqachon EduPortalda o'qimoqda. Siz ham qo'shiling — bepul!
          </p>
          <Link to="/register"
            className="btn btn-lg bg-white text-teal-700 hover:bg-teal-50 shadow-lg font-bold inline-flex">
            Bepul Boshlash <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
