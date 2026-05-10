import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4500); return () => clearTimeout(t); }, [onClose]);

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-2xl shadow-xl border min-w-64 max-w-80 anim-scale
      ${type === 'success' ? 'bg-white border-emerald-200' : 'bg-white border-red-200'}`}>
      <div className={`mt-0.5 w-7 h-7 rounded-xl flex items-center justify-center shrink-0
        ${type === 'success' ? 'bg-emerald-50' : 'bg-red-50'}`}>
        {type === 'success'
          ? <CheckCircle size={15} className="text-emerald-600" />
          : <XCircle size={15} className="text-red-500" />}
      </div>
      <p className={`flex-1 text-sm font-medium pt-0.5 ${type === 'success' ? 'text-slate-700' : 'text-slate-700'}`}>{message}</p>
      <button onClick={onClose} className="mt-0.5 p-1 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors">
        <X size={13} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, remove }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed top-20 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast {...t} onClose={() => remove(t.id)} />
        </div>
      ))}
    </div>
  );
}

let _listeners = [];
export const toast = {
  success: (msg) => _listeners.forEach(fn => fn({ type: 'success', message: msg })),
  error:   (msg) => _listeners.forEach(fn => fn({ type: 'error',   message: msg })),
  subscribe: (fn) => { _listeners.push(fn); return () => { _listeners = _listeners.filter(f => f !== fn); }; },
};

export function useToast() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => toast.subscribe(({ type, message }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, message }]);
  }), []);
  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));
  return { toasts, remove };
}
