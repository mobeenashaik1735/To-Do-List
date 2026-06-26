import { useState, useEffect, useContext } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import TaskHistory from './components/TaskHistory';
import Login from './components/Login';
import Register from './components/Register';
import { AuthContext } from './context/AuthContext';
import './App.css';

export default function App() {
  const auth = useContext(AuthContext);
  const token = auth?.token ?? null;
  const user = auth?.user ?? null;
  const logout = auth?.logout;
  const changePassword = auth?.changePassword;
  const [authView, setAuthView] = useState('login');

  // --- TODO STATES ---
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(true); // Always dark exactly like image_cb1fb9.png
  const [showHistory, setShowHistory] = useState(false);

  const getTodosStorageKey = (username) => `todos_${username}`;

  const loadTodosForUser = (username) => {
    const savedTodos = localStorage.getItem(getTodosStorageKey(username));
    return savedTodos ? JSON.parse(savedTodos) : [];
  };

  const saveTodosForUser = (username, todoList) => {
    localStorage.setItem(getTodosStorageKey(username), JSON.stringify(todoList));
  };

  // Login / register / page refresh — load that user's saved tasks only
  useEffect(() => {
    if (token && user?.username) {
      setTodos(loadTodosForUser(user.username));
    } else {
      setTodos([]);
    }
  }, [token, user?.username]);

  const handleLogout = () => {
    logout?.();
    setTodos([]);
    setShowHistory(false);
  };

  // --- TODO ACTIONS ---
  const handleAddTodo = (todoData) => {
    if (!user?.username) return;

    const newTodo = {
      _id: Date.now().toString(),
      ...todoData,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    const updated = [newTodo, ...todos];
    setTodos(updated);
    saveTodosForUser(user.username, updated);
  };

  const handleToggleTodo = (id, updatedFields) => {
    if (!user?.username) return;

    const updated = todos.map(t => {
      if (t._id !== id) return t;
      const completed = updatedFields.completed ?? t.completed;
      return {
        ...t,
        ...updatedFields,
        completedAt: completed ? (t.completedAt || new Date().toISOString()) : null,
      };
    });
    setTodos(updated);
    saveTodosForUser(user.username, updated);
  };

  const handleDeleteTodo = (id) => {
    if (!user?.username) return;

    const updated = todos.filter(t => t._id !== id);
    setTodos(updated);
    saveTodosForUser(user.username, updated);
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'All' || 
      (filter === 'Active' && !todo.completed) || 
      (filter === 'Completed' && todo.completed);
    const matchesSearch = todo.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={`app-wrapper ${darkMode ? 'dark-theme' : ''}`}>
      {/* నావిగేషన్ బార్ కి లాగ్అవుట్ ఫంక్షన్ పంపిస్తాం */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        customUser={user}
        customLogout={handleLogout}
        onHistoryClick={() => setShowHistory(true)}
        onChangePassword={changePassword}
      />

      {token && showHistory && (
        <div className="history-overlay" onClick={() => setShowHistory(false)}>
          <div className="history-modal" onClick={e => e.stopPropagation()}>
            <TaskHistory todos={todos} onClose={() => setShowHistory(false)} />
          </div>
        </div>
      )}
      
      <main className="content-container">
        {!token ? (
          <div className="auth-wrapper">
            {authView === 'login' ? (
              <Login switchToRegister={() => setAuthView('register')} />
            ) : (
              <Register switchToLogin={() => setAuthView('login')} />
            )}
          </div>
        ) : (
          /* --- SECOND PAGE: DASHBOARD & DYNAMIC TASK AREA --- */
          <>
            <Dashboard todos={todos} />
            <TodoForm onAdd={handleAddTodo} />

            <div className="filter-controls">
              <input 
                type="text" 
                placeholder="🔍 Search tasks by title..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="search-input"
              />
              <select value={filter} onChange={e => setFilter(e.target.value)} className="filter-select">
                <option>All</option>
                <option>Active</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="todo-list-container">
              {filteredTodos.length > 0 ? (
                filteredTodos.map(todo => (
                  <TodoItem 
                    key={todo._id} 
                    todo={todo} 
                    onToggle={handleToggleTodo} 
                    onDelete={handleDeleteTodo} 
                  />
                ))
              ) : (
                <p className="no-tasks" style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '30px', fontSize: '15px' }}>
                  No tasks available. Add a new task to get started!
                </p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}