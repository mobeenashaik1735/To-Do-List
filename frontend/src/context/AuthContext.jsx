import { createContext, useCallback, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

const safeParse = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeUsers = (data) => {
  if (!Array.isArray(data)) return [];
  return data.filter(
    u => u && typeof u.username === 'string' && typeof u.email === 'string'
  );
};

const loadUsers = () => normalizeUsers(safeParse('registeredUsers', []));

const saveUsers = (users) => {
  localStorage.setItem('registeredUsers', JSON.stringify(users));
};

const persistSession = (nextUser, nextToken) => {
  localStorage.setItem('userToken', nextToken);
  localStorage.setItem('currentUser', JSON.stringify(nextUser));
};

const clearSession = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('currentUser');
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('userToken') || null);
  const [user, setUser] = useState(() => safeParse('currentUser', null));
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const users = loadUsers();
    if (users.length > 0) {
      saveUsers(users);
    }
    return users;
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('userToken');
    const savedUser = safeParse('currentUser', null);
    if (savedToken && (!savedUser || !savedUser.username)) {
      clearSession();
      setToken(null);
      setUser(null);
    }
  }, []);

  const register = useCallback((username, email, password) => {
    try {
      const trimmedUsername = username.trim();
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
        return { success: false, message: 'Please fill in all fields' };
      }

      const users = loadUsers();

      const usernameExists = users.some(
        u => u.username.toLowerCase() === trimmedUsername.toLowerCase()
      );
      if (usernameExists) {
        return { success: false, message: 'Username already taken!' };
      }

      const emailExists = users.some(
        u => u.email.toLowerCase() === trimmedEmail.toLowerCase()
      );
      if (emailExists) {
        return { success: false, message: 'Email already registered!' };
      }

      const newUser = {
        username: trimmedUsername,
        email: trimmedEmail,
        password: trimmedPassword,
        registeredAt: new Date().toISOString(),
      };
      const updatedUsers = [...users, newUser];

      saveUsers(updatedUsers);
      setRegisteredUsers(updatedUsers);

      const mockToken = `token_${trimmedUsername}_${Date.now()}`;
      persistSession(newUser, mockToken);
      setToken(mockToken);
      setUser(newUser);

      return { success: true };
    } catch (err) {
      console.error('Registration failed:', err);
      return { success: false, message: 'Registration failed. Please clear browser data and try again.' };
    }
  }, []);

  const login = useCallback((loginIdentifier, password) => {
    try {
      const id = loginIdentifier.trim();
      const pass = password.trim();

      if (!id || !pass) {
        return { success: false, message: 'Please fill in all fields' };
      }

      const users = loadUsers();
      const foundUser = users.find(
        u =>
          (u.username.toLowerCase() === id.toLowerCase() ||
            u.email.toLowerCase() === id.toLowerCase()) &&
          u.password === pass
      );

      if (!foundUser) {
        return { success: false, message: 'Invalid Username/Email or Password' };
      }

      const mockToken = `token_${foundUser.username}_${Date.now()}`;
      persistSession(foundUser, mockToken);
      setToken(mockToken);
      setUser(foundUser);
      setRegisteredUsers(users);

      return { success: true };
    } catch (err) {
      console.error('Login failed:', err);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  const changePassword = useCallback((currentPassword, newPassword) => {
    if (!user?.username) {
      return { success: false, message: 'Not logged in' };
    }
    if (user.password !== currentPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }

    const users = loadUsers();
    const updatedUser = { ...user, password: newPassword };
    const updatedUsers = users.map(u =>
      u.username.toLowerCase() === user.username.toLowerCase() ? updatedUser : u
    );

    saveUsers(updatedUsers);
    setRegisteredUsers(updatedUsers);
    setUser(updatedUser);
    persistSession(updatedUser, token);

    return { success: true };
  }, [user, token]);

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
