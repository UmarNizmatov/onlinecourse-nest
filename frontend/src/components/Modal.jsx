import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ title, children, onClose, wide = false }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm anim-in" onClick={onClose} />
      <div className={`relative bg-white w-full anim-scale rounded-t-3xl sm:rounded-2xl shadow-2xl
        ${wide ? 'sm:max-w-2xl' : 'sm:max-w-md'}`}
        style={{ maxHeight: '92dvh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 z-10">
          <h2 className="font-semibold text-slate-800 text-base">{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="Yopish">
            <X size={17} />
          </button>
        </div>
        <div className="px-5 sm:px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
