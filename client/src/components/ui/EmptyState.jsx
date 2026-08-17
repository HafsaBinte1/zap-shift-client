export default function EmptyState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-box border border-base-200 bg-base-100 px-6 py-16 text-center">
      <h3 className="text-lg font-semibold text-base-content">{title}</h3>
      {message && <p className="max-w-sm text-sm text-neutral">{message}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
