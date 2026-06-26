import { useState, useRef, useEffect } from 'react';

const formatDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' }) : '—';

export default function UserProfile({ user, onChangePassword, onLogout }) {
  const [open, setOpen] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const menuRef = useRef(null);

  const initial = user?.username?.charAt(0)?.toUpperCase() || '?';

  const resetExpandedSections = () => {
    setShowEmail(false);
    setShowRegistration(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
        resetExpandedSections();
        setShowPasswordForm(false);
        setProfileError('');
        setProfileSuccess('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setProfileError('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setProfileError('New passwords do not match');
      return;
    }
    if (newPassword.length < 4) {
      setProfileError('Password must be at least 4 characters');
      return;
    }

    const result = onChangePassword(currentPassword, newPassword);
    if (result.success) {
      setProfileSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } else {
      setProfileError(result.message || 'Failed to update password');
    }
  };

  return (
    <div className="user-profile" ref={menuRef}>
      <button
        type="button"
        className={`user-profile-trigger ${open ? 'open' : ''}`}
        onClick={() => {
          setOpen(prev => {
            if (prev) resetExpandedSections();
            return !prev;
          });
          setShowPasswordForm(false);
          setProfileError('');
          setProfileSuccess('');
        }}
        title={user.username}
      >
        <span className="user-avatar">{initial}</span>
        {open && <span className="user-profile-trigger-name">{user.username}</span>}
      </button>

      {open && (
        <div className="user-profile-menu">
          <div className="user-profile-header">
            <div className="user-avatar user-avatar-lg">{initial}</div>
            <p className="user-profile-name">{user.username}</p>
          </div>

          <div className="user-profile-info">
            <button
              type="button"
              className={`user-profile-expand ${showEmail ? 'expanded' : ''}`}
              onClick={() => setShowEmail(prev => !prev)}
            >
              <span className="user-profile-expand-label">
                <span>📧</span> Email
              </span>
              <span className="user-profile-expand-arrow">{showEmail ? '▲' : '▼'}</span>
            </button>
            {showEmail && (
              <div className="user-profile-expand-content">
                <a href={`mailto:${user.email}`} className="user-profile-mail-link">
                  {user.email}
                </a>
              </div>
            )}

            <button
              type="button"
              className={`user-profile-expand ${showRegistration ? 'expanded' : ''}`}
              onClick={() => setShowRegistration(prev => !prev)}
            >
              <span className="user-profile-expand-label">
                <span>📋</span> Registration Details
              </span>
              <span className="user-profile-expand-arrow">{showRegistration ? '▲' : '▼'}</span>
            </button>
            {showRegistration && (
              <div className="user-profile-expand-content">
                <span className="user-profile-value">{formatDateTime(user.registeredAt)}</span>
              </div>
            )}
          </div>

          {!showPasswordForm ? (
            <button
              type="button"
              className="user-profile-action"
              onClick={() => {
                setShowPasswordForm(true);
                setProfileError('');
                setProfileSuccess('');
              }}
            >
              Change Password
            </button>
          ) : (
            <form className="user-password-form" onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              {profileError && <p className="user-profile-error">{profileError}</p>}
              {profileSuccess && <p className="user-profile-success">{profileSuccess}</p>}
              <div className="user-password-actions">
                <button type="submit" className="btn-profile-save">Save</button>
                <button
                  type="button"
                  className="btn-profile-cancel"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setProfileError('');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {profileSuccess && !showPasswordForm && (
            <p className="user-profile-success">{profileSuccess}</p>
          )}

          <button type="button" className="user-profile-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
