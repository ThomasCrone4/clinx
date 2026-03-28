import { createContext, useContext, useState, type ReactNode } from 'react';
import { getTeacherById } from '../services/dataService';
import type { User, AuthUser, UserRole } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => { success: boolean; role?: UserRole; error?: string };
  logout: () => void;
  DEMO_ACCOUNTS: User[];
}

const AuthContext = createContext<AuthContextValue | null>(null);

const teacher1 = getTeacherById('T001');

const DEMO_ACCOUNTS: User[] = [
  { email: 'admin@clinx.uk', password: 'demo', role: 'siteAdmin', name: 'Clinx Admin', teacherId: null },
  { email: 'head@dedworth.school', password: 'demo', role: 'schoolAdmin', name: 'Mrs. J. Whitfield (Headteacher)', teacherId: null },
  { email: 'dsl@dedworth.school', password: 'demo', role: 'schoolAdmin', name: 'Mr. P. Hargreaves (DSL)', teacherId: null },
  { email: 't.smith@dedworth.school', password: 'demo', role: 'teacher', name: teacher1?.name || 'Mr. T. Smith', teacherId: 'T001' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  function login(email: string, password: string): { success: boolean; role?: UserRole; error?: string } {
    const account = DEMO_ACCOUNTS.find(a => a.email === email && a.password === password);
    if (account) {
      setUser({ email: account.email, role: account.role, name: account.name, teacherId: account.teacherId });
      return { success: true, role: account.role };
    }
    return { success: false, error: 'Invalid credentials' };
  }

  function logout() { setUser(null); }

  return (
    <AuthContext.Provider value={{ user, login, logout, DEMO_ACCOUNTS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
