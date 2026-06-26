const formatDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export default function TaskHistory({ todos, onClose }) {
  const historyItems = [...todos].sort((a, b) => {
    const dateA = new Date(a.completedAt || a.createdAt || 0);
    const dateB = new Date(b.completedAt || b.createdAt || 0);
    return dateB - dateA;
  });

  if (historyItems.length === 0) {
    return (
      <div className="task-history-panel">
        <div className="task-history-header">
          <h3 className="task-history-title">Task History</h3>
          <button type="button" className="btn-history-close" onClick={onClose}>✕</button>
        </div>
        <p className="task-history-empty">No previous tasks yet. Add your first task below.</p>
      </div>
    );
  }

  return (
    <div className="task-history-panel">
      <div className="task-history-header">
        <h3 className="task-history-title">Task History</h3>
        <div className="task-history-header-actions">
          <span className="task-history-count">{historyItems.length} task{historyItems.length !== 1 ? 's' : ''}</span>
          <button type="button" className="btn-history-close" onClick={onClose}>✕</button>
        </div>
      </div>
      <div className="task-history-list">
        {historyItems.map(todo => (
          <div key={todo._id} className={`task-history-item ${todo.completed ? 'done' : 'active'}`}>
            <div className="task-history-item-top">
              <span className="task-history-status">{todo.completed ? '✓ Done' : '● Active'}</span>
              <span className="task-history-priority">{todo.priority || 'Medium'}</span>
            </div>
            <p className="task-history-name">{todo.title}</p>
            <div className="task-history-dates">
              <span>Added: {formatDateTime(todo.createdAt)}</span>
              {todo.completed && <span>Completed: {formatDateTime(todo.completedAt)}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
