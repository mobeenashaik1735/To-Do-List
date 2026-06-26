const formatDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : null;

export default function TodoItem({ todo, onToggle, onDelete }) {
  const createdLabel = formatDateTime(todo.createdAt);
  const completedLabel = todo.completed ? formatDateTime(todo.completedAt) : null;

  return (
    <div className={`todo-card ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-details">
        <h3>{todo.title}</h3>
        <div className="todo-meta">
          <span className={`badge ${todo.category?.toLowerCase() || 'personal'}`}>{todo.category || 'Personal'}</span>
          <span className={`badge ${todo.priority?.toLowerCase() || 'medium'}`}>{todo.priority || 'Medium'}</span>
          {todo.dueDate && (
            <span className="tag-date">📅 {new Date(todo.dueDate).toLocaleDateString()}</span>
          )}
        </div>
        {(createdLabel || completedLabel) && (
          <div className="todo-history">
            {createdLabel && <span>Added: {createdLabel}</span>}
            {completedLabel && <span>Completed: {completedLabel}</span>}
          </div>
        )}
      </div>
      <div className="todo-actions">
        <button 
          className="btn-action" 
          onClick={() => onToggle(todo._id, { completed: !todo.completed })}
        >
          {todo.completed ? 'Undo' : 'Complete'}
        </button>
        <button 
          className="btn-action delete" 
          onClick={() => onDelete(todo._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}