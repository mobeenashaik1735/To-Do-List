import UserProfile from './UserProfile';

export default function Navbar({ darkMode, setDarkMode, customUser, customLogout, onHistoryClick, onChangePassword }) {
  return (
    <nav className="navbar">
      <div className="nav-logo">To-Do List</div>
      
      <div className="nav-actions">
        <button onClick={() => setDarkMode(!darkMode)} className="btn-toggle">
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
        
        {customUser && (
          <>
            <button onClick={onHistoryClick} className="btn-history">
              📜 History
            </button>
            <UserProfile
              user={customUser}
              onChangePassword={onChangePassword}
              onLogout={customLogout}
            />
          </>
        )}
      </div>
    </nav>
  );
}
