import { STATUS_STEPS, STATUS_LABELS } from '../../utils/constants';

export default function StatusTimeline({ status, history = [] }) {
  const isCancelled = status === 'cancelled';
  const currentIndex = STATUS_STEPS.indexOf(status);
  const historyByStatus = Object.fromEntries(history.map((h) => [h.status, h]));

  if (isCancelled) {
    const cancelledLog = historyByStatus.cancelled;
    return (
      <div className="rounded-box border border-error/30 bg-error/10 p-4">
        <p className="font-semibold text-error">Cancelled by sender</p>
        {cancelledLog && <p className="text-xs text-neutral mt-1">{new Date(cancelledLog.at).toLocaleString()}</p>}
      </div>
    );
  }

  return (
    <ul className="timeline timeline-vertical">
      {STATUS_STEPS.map((step, i) => {
        const done = currentIndex >= i;
        const log = historyByStatus[step];
        return (
          <li key={step}>
            {i > 0 && <hr className={done ? 'bg-primary' : ''} />}
            <div className="timeline-start text-xs text-neutral whitespace-nowrap">
              {log ? new Date(log.at).toLocaleString() : ''}
            </div>
            <div className="timeline-middle">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full ${
                  done ? 'bg-primary text-primary-content' : 'bg-base-200 text-neutral'
                }`}
              >
                {done ? '✓' : ''}
              </span>
            </div>
            <div className={`timeline-end timeline-box ${done ? 'border-primary/30' : ''}`}>
              <p className={`font-medium ${done ? 'text-base-content' : 'text-neutral'}`}>{STATUS_LABELS[step]}</p>
              {log?.note && <p className="mt-1 text-xs text-neutral">"{log.note}"</p>}
            </div>
            {i < STATUS_STEPS.length - 1 && <hr className={currentIndex > i ? 'bg-primary' : ''} />}
          </li>
        );
      })}
    </ul>
  );
}
