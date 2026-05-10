export default function Spinner({ size = 28 }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div
        style={{
          width: size, height: size,
          border: '3px solid #e2e8f0',
          borderTopColor: '#0D9488',
          borderRadius: '50%',
        }}
        className="anim-spin"
      />
      <p className="text-sm text-slate-400">Yuklanmoqda...</p>
    </div>
  );
}

export function InlineSpinner() {
  return (
    <div style={{
      width: 16, height: 16,
      border: '2px solid rgba(255,255,255,0.3)',
      borderTopColor: '#fff',
      borderRadius: '50%',
      display: 'inline-block',
    }} className="anim-spin" />
  );
}
