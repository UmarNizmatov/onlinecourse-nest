import { useState, useEffect } from 'react';
import { getCourses } from '../api';
import CourseCard from '../components/CourseCard';
import Spinner from '../components/Spinner';
import { Search, BookOpen, SlidersHorizontal } from 'lucide-react';

const LEVELS = [
  { value: 'all',          label: 'Barchasi' },
  { value: 'beginner',     label: "Boshlang'ich" },
  { value: 'intermediate', label: "O'rta" },
  { value: 'advanced',     label: "Ilg'or" },
];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('all');

  useEffect(() => {
    getCourses()
      .then(({ data }) => setCourses(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q);
    const matchLevel = level === 'all' || c.level === level;
    return matchSearch && matchLevel;
  });

  return (
    <div>
      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">Barcha Kurslar</h1>
          <p className="text-slate-500 text-sm">Qiziqtirgan sohangizdagi kursni toping va o'rganishni boshlang</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Kurs, kategoriya qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
              aria-label="Kurs qidirish"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {LEVELS.map((l) => (
              <button key={l.value} onClick={() => setLevel(l.value)}
                className={`btn btn-sm whitespace-nowrap ${level === l.value ? 'btn-primary' : 'btn-secondary'}`}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <BookOpen size={28} className="text-slate-300" />
            </div>
            <p className="font-semibold text-slate-500 text-lg">Kurs topilmadi</p>
            <p className="text-slate-400 text-sm mt-1">Qidiruv so'rovini o'zgartiring</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-400 mb-4 font-medium">{filtered.length} ta kurs topildi</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filtered.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
