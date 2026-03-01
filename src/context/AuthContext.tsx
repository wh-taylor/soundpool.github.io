import { createContext, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../data/storageKeys';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextValue {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  signup: (userData: Omit<User, 'id' | 'joinDate' | 'lastActive' | 'profileComments'>) => boolean;
  updateUser: (patch: Partial<User>) => void;
  getUserById: (id: string) => User | undefined;
  getUserByUsername: (username: string) => User | undefined;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useLocalStorage<User[]>(STORAGE_KEYS.USERS, MOCK_USERS);
  const [currentUserId, setCurrentUserId] = useLocalStorage<string | null>(
    STORAGE_KEYS.CURRENT_USER_ID,
    null
  );

  const currentUser = currentUserId
    ? (users.find((u) => u.id === currentUserId) ?? null)
    : null;

  const login = useCallback(
    (email: string, password: string): boolean => {
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!user) return false;
      // Update lastActive
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, lastActive: new Date().toISOString() } : u
        )
      );
      setCurrentUserId(user.id);
      return true;
    },
    [users, setUsers, setCurrentUserId]
  );

  const logout = useCallback(() => {
    setCurrentUserId(null);
  }, [setCurrentUserId]);

  const signup = useCallback(
    (userData: Omit<User, 'id' | 'joinDate' | 'lastActive' | 'profileComments'>): boolean => {
      const exists = users.some(
        (u) =>
          u.email.toLowerCase() === userData.email.toLowerCase() ||
          u.username.toLowerCase() === userData.username.toLowerCase()
      );
      if (exists) return false;

      const newUser: User = {
        ...userData,
        id: crypto.randomUUID(),
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        profileComments: [],
      };
      setUsers((prev) => [...prev, newUser]);
      setCurrentUserId(newUser.id);
      return true;
    },
    [users, setUsers, setCurrentUserId]
  );

  const updateUser = useCallback(
    (patch: Partial<User>) => {
      if (!currentUserId) return;
      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUserId
            ? { ...u, ...patch, lastActive: new Date().toISOString() }
            : u
        )
      );
    },
    [currentUserId, setUsers]
  );

  const getUserById = useCallback(
    (id: string) => users.find((u) => u.id === id),
    [users]
  );

  const getUserByUsername = useCallback(
    (username: string) =>
      users.find((u) => u.username.toLowerCase() === username.toLowerCase()),
    [users]
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        logout,
        signup,
        updateUser,
        getUserById,
        getUserByUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
