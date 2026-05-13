import { useState } from 'react';

const PRIORITY_LABELS = { high: '↑ High', medium: '→ Med', low: '↓ Low' };
const PRIORITY_CLASS  = { high: 'badge--high', medium: 'badge--medium', low: 'badge--low' };

function formatDate(str) {
  if (!str) return null;
  return new Date(str).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function isOverdue(dueDate, status) {
  if (!dueDate || status === 'completed') return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [editing,      setEditing]      = useState(false);
  const [editTitle,    setEditTitle]    = useState(task.title);
  const [editDesc,     setEditDesc]     = useState(task.description || '');
  const [editPriority, setEditPriority] = useState(task.priority    || 'medium');
  const [editDueDate,  setEditDueDate]  = useState(task.due_date    || '');
  const [editError,    setEditError]    = useState('');
  const [saving,       setSaving]       = useState(false);

  const overdue   = isOverdue(task.due_date, task.status);
  const completed = task.status === 'completed';

  const handleSave = async () => {
    if (!editTitle.trim()) {
      setEditError('Title cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      await onUpdate(task.id, {
        title:       editTitle.trim(),
        description: editDesc.trim(),
        priority:    editPriority,
        due_date:    editDueDate || null,
      });
      setEditing(false);
      setEditError('');
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${task.title}"?\nThis cannot be undone.`)) {
      onDelete(task.id);
    }
  };

  return (
    <div className={`task-item ${completed ? 'task-item--done' : ''} ${overdue ? 'task-item--overdue' : ''}`}>

      {editing ? (
        <div className="task-edit">
          {editError && <p className="form-error" role="alert">⚠ {editError}</p>}
          <input
            className={`field-input ${editError ? 'field-input--error' : ''}`}
            value={editTitle}
            onChange={(e) => { setEditTitle(e.target.value); setEditError(''); }}
            maxLength={255}
            aria-label="Edit title"
          />
          <textarea
            className="field-input field-textarea"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            rows={2}
            aria-label="Edit description"
          />
          <div className="field-row">
            <select
              className="field-input field-select"
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
            >
              <option value="high">↑ High</option>
              <option value="medium">→ Medium</option>
              <option value="low">↓ Low</option>
            </select>
            <input
              className="field-input"
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
            />
          </div>
          <div className="edit-actions">
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button className="btn-cancel" onClick={() => { setEditing(false); setEditError(''); }}>
              Cancel
            </button>
          </div>
        </div>

      ) : (
        <>
          <div className="task-main">
            <button
              className={`task-checkbox ${completed ? 'task-checkbox--done' : ''}`}
              onClick={() => onToggle(task.id)}
              aria-label={completed ? 'Mark as pending' : 'Mark as completed'}
            >
              {completed ? '✓' : ''}
            </button>

            <div className="task-content">
              <span className={`task-title ${completed ? 'task-title--done' : ''}`}>
                {task.title}
              </span>
              {task.description && (
                <p className="task-desc">{task.description}</p>
              )}
              <div className="task-meta">
                <span className={`badge ${PRIORITY_CLASS[task.priority] || 'badge--medium'}`}>
                  {PRIORITY_LABELS[task.priority] || '→ Med'}
                </span>
                {task.due_date && (
                  <span className={`task-due ${overdue ? 'task-due--overdue' : ''}`}>
                    {overdue ? '⚠ Overdue · ' : '📅 '}
                    {formatDate(task.due_date)}
                  </span>
                )}
                <span className="task-created">Added {formatDate(task.created_at)}</span>
              </div>
            </div>
          </div>

          <div className="task-actions">
            <button className="btn-edit"   onClick={() => setEditing(true)} aria-label="Edit task">✎</button>
            <button className="btn-delete" onClick={handleDelete}           aria-label="Delete task">✕</button>
          </div>
        </>
      )}
    </div>
  );
}