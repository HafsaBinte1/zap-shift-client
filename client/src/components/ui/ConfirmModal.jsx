export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onClose }) {
  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold text-base-content">{title}</h3>
        <p className="py-3 text-sm text-neutral">{message}</p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className={`btn ${danger ? 'btn-error' : 'btn-primary'}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}
