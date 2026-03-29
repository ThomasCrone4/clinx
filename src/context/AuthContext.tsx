import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { getTeacherById } from '../services/dataService';
import type { DemoAccount, UserRole } from '../types/domain';

type LoginResult =
  | { success: true; role: UserRole }
  | { success: false; error: string };

type AuthContextValue = {
  user: DemoAccount | null;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
  DEMO_ACCOUNTS: DemoAccount[];
};

const AuthContext = createContext<AuthContextValue | null>(null);

const teacher1 = getTeacherById('T001');

const DEMO_ACCOUNTS: DemoAccount[] = [
  { email: 'admin@clinx.uk', password: 'demo', role: 'siteAdmin', name: 'Clinx Admin', teacherId: null, schoolId: null },
  {
    email: 'b.day@dedworth.school',
    password: 'demo',
    role: 'schoolAdmin',
    name: 'Mr Brad Day (Assistant Headteacher)',
    teacherId: null,
    schoolId: 'school-dedworth',
  },
  {
    email: 'dsl@dedworth.school',
    password: 'demo',
    role: 'schoolAdmin',
    name: 'Mr. P. Hargreaves (DSL)',
    teacherId: null,
    schoolId: 'school-dedworth',
  },
  {
    email: 't.smith@dedworth.school',
    password: 'demo',
    role: 'teacher',
    name: teacher1?.name || 'Mr. T. Smith',
    teacherId: 'T001',
    schoolId: 'school-dedworth',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoAccount | null>(null);

  function login(email: string, password: string): LoginResult {
    const account = DEMO_ACCOUNTS.find((item) => item.email === email && item.password === password);
    if (account) {
      setUser({ ...account });
      return { success: true, role: account.role };
    }

    return { success: false, error: 'Invalid credentials' };
  }

  function logout() {
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout, DEMO_ACCOUNTS }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
