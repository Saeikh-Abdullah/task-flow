import { useState, useEffect, useCallback } from 'react';
import { tasksService } from './services/tasksService';
import TaskForm  from './components/TaskForm';
import TaskItem  from './components/TaskItem';
import FilterBar from './components/FilterBar';
import './index.css';

export default function App() {
  const [tasks,      setTasks]      = useState([]);
  const [filter,     setFilter]     = useState('all');
  const [loading,    setLoading]    = useState(true);
  const [fetchError, setFetchError] = useState('');

  const loadTasks = useCallback(async () => {
    try {
      const res = await tasksService.getAll();
      setTasks(res.data);
      setFetchError('');
    } catch (err) {
      setFetchError('Could not load tasks. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const handleAdd = async (payload) => {
    const res = await tasksService.create(payload);
    setTasks((prev) => [res.data, ...prev]);
  };

  const handleToggle = async (id) => {
    const res = await tasksService.toggle(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
  };

  const handleDelete = async (id) => {
    await tasksService.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdate = async (id, payload) => {
    const res = await tasksService.update(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
  };

  const counts = {
    all:       tasks.length,
    pending:   tasks.filter((t) => t.status === 'pending').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  const filtered = filter === 'all'
    ? tasks
    : tasks.filter((t) => t.status === filter);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-mark">TF</span>
            <span className="logo-text">Task<em>Flow</em></span>
          </div>
          <p className="header-tagline">Your tasks. Your flow.</p>
        </div>
      </header>

      <main className="app-main">
        <div className="layout">
          <aside className="sidebar">
            <TaskForm onAdd={handleAdd} />
          </aside>

          <section className="task-list-section">
            <div className="list-header">
              <FilterBar current={filter} onChange={setFilter} counts={counts} />
            </div>

            {fetchError && (
              <div className="fetch-error" role="alert">
                <strong>Error:</strong> {fetchError}
                <button className="btn-retry" onClick={loadTasks}>Retry</button>
              </div>
            )}

            {loading ? (
              <div className="loading-state">
                <span className="spinner" />
                <p>Loading tasks…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">
                  {filter === 'completed' ? '🎉' : '📋'}
                </span>
                <p>
                  {filter === 'completed'
                    ? 'Nothing completed yet.'
                    : filter === 'pending'
                    ? 'No pending tasks — you are all caught up!'
                    : 'No tasks yet. Add one to get started!'}
                </p>
              </div>
            ) : (
              <ul className="task-list" aria-label="Task list">
                {filtered.map((task) => (
                  <li key={task.id}>
                    <TaskItem
                      task={task}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                      onUpdate={handleUpdate}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}