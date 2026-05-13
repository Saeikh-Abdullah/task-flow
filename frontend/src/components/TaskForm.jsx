import { useState } from 'react';

export default function TaskForm({ onAdd }) {
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [priority,    setPriority]    = useState('medium');
  const [dueDate,     setDueDate]     = useState('');
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required — give your task a name.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onAdd({
        title:       title.trim(),
        description: description.trim(),
        priority,
        due_date:    dueDate || undefined,
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-card">
      <h2 className="form-heading">New Task</h2>

      {error && (
        <p className="form-error" role="alert">
          ⚠ {error}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="field-group">
          <input
            className={`field-input ${error && !title.trim() ? 'field-input--error' : ''}`}
            type="text"
            placeholder="Task title *"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            maxLength={255}
            aria-label="Task title"
          />
          <textarea
            className="field-input field-textarea"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            aria-label="Task description"
          />
          <div className="field-row">
            <select
              className="field-input field-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              aria-label="Priority"
            >
              <option value="high">↑ High</option>
              <option value="medium">→ Medium</option>
              <option value="low">↓ Low</option>
            </select>
            <input
              className="field-input"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              aria-label="Due date"
            />
          </div>
        </div>
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Adding…' : '+ Add Task'}
        </button>
      </form>
    </div>
  );
}