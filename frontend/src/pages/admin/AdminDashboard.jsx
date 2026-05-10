import { useState, useEffect } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Spinner, { InlineSpinner } from '../../components/Spinner';
import Modal from '../../components/Modal';
import { toast } from '../../components/Toast';
import { BookOpen, Plus, Pencil, Trash2, Shield, BarChart2 } from 'lucide-react';

const LEVELS = [
  { value: 'beginner',     label: "Boshlang'ich" },
  { value: 'intermediate', label: "O'rta" },
  { value: 'advanced',     label: "Ilg'or" },
];
const EMPTY = { name: '', description: '', price: 0, teacherId: '', category: '', level: 'beginner' };

export default function AdminDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => getCourses().then(({ data }) => setCourses(data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditTarget(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (c) => {
    setEditTarget(c);
    setForm({ name: c.name, description: c.description || '', price: c.price || 0, teacherId: c.teacher?.id || '', category: c.category || '', level: c.level });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editTarget) { await updateCourse(editTarget.id, form); toast.success("Kurs yangilandi!"); }
      else            { await createCourse(form);              toast.success("Kurs yaratildi!"); }
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || "Xatolik"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await deleteCourse(deleteTarget.id); toast.success("Kurs o'chirildi!"); setDeleteTarget(null); load(); }
    catch (err) { toast.error(err.response?.data?.message || "Xatolik"); }
  };

  if (loading) return <Spinner />;

  const free = courses.filter(c => c.price == 0).length;
  const paid = courses.filter(c => c.price > 0).length;

  const INPUT = 'input';
  const SELECT = 'input bg-white';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 anim-up">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 hero-gradient rounded-2xl flex items-center justify-center shadow-sm">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Paneli</h1>
            <p className="text-slate-500 text-xs">{user?.email}</p>
          </div>
        </div>
        <button onClick={openCreate} className="btn btn-primary">
          <Plus size={15} /> Yangi Kurs
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Jami kurslar',  value: courses.length, grad: 'strip-teal',   Icon: BookOpen },
          { label: 'Bepul kurslar', value: free,           grad: 'strip-green',  Icon: BarChart2 },
          { label: 'Pullik kurslar',value: paid,           grad: 'strip-orange', Icon: Shield },
        ].map(({ label, value, grad, Icon }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 ${grad} rounded-2xl flex items-center justify-center shadow-sm shrink-0`}>
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-800">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-700">Barcha kurslar</h2>
          <span className="badge badge-teal">{courses.length} ta</span>
        </div>

        {courses.length === 0 ? (
          <div className="p-14 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <BookOpen size={26} className="text-slate-300" />
            </div>
            <p className="font-semibold text-slate-400">Hali kurslar yo'q</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] table-auto table-styled">
              <thead>
                <tr>
                  <th>Kurs nomi</th>
                  <th>Kategoriya</th>
                  <th>Daraja</th>
                  <th className="text-right">Narx</th>
                  <th className="text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <p className="font-medium text-slate-800">{c.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">{c.description}</p>
                    </td>
                    <td className="text-slate-500">{c.category || '—'}</td>
                    <td>
                      <span className={`badge ${c.level === 'beginner' ? 'badge-green' : c.level === 'intermediate' ? 'badge-amber' : 'badge-red'}`}>
                        {LEVELS.find(l => l.value === c.level)?.label || c.level}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className={`font-semibold text-sm ${c.price == 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                        {c.price == 0 ? "Bepul" : `${Number(c.price).toLocaleString()} so'm`}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(c)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-colors cursor-pointer"
                          aria-label="Tahrirlash">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteTarget(c)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                          aria-label="O'chirish">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit modal */}
      {showModal && (
        <Modal title={editTarget ? "Kursni Tahrirlash" : "Yangi Kurs"} onClose={() => setShowModal(false)} wide>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kurs nomi *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Kurs nomi" className={INPUT} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tavsif *</label>
                <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Kurs tavsifi..." className={INPUT + ' resize-none'} style={{ height: 'auto' }} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategoriya *</label>
                <input type="text" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Dasturlash" className={INPUT} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Daraja *</label>
                <select required value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className={SELECT}>
                  {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Narx (so'm)</label>
                <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0 = bepul" className={INPUT} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">O'qituvchi UUID</label>
                <input type="text" value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })} placeholder="UUID" className={INPUT} />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost flex-1 border border-slate-200">Bekor qilish</button>
              <button type="submit" disabled={saving} className="btn btn-primary flex-1">
                {saving ? <InlineSpinner /> : null}
                {saving ? 'Yuklanmoqda...' : editTarget ? 'Yangilash' : 'Yaratish'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <Modal title="Kursni O'chirish" onClose={() => setDeleteTarget(null)}>
          <div className="text-center py-2">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <p className="font-semibold text-slate-700 mb-1">O'chirishni tasdiqlang</p>
            <p className="text-sm text-slate-500 mb-6">
              "<span className="font-medium text-slate-700">{deleteTarget.name}</span>" kursi o'chiriladi. Bu amalni qaytarib bo'lmaydi.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn btn-ghost flex-1 border border-slate-200">Bekor qilish</button>
              <button onClick={handleDelete} className="btn btn-danger flex-1 font-semibold" style={{ background: '#dc2626', color: '#fff', borderColor: '#dc2626' }}>
                O'chirish
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
