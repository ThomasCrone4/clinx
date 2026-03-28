import { createContext, useContext, useState } from 'react';
import { getTeacherById } from '../services/dataService';

const AuthContext = createContext(null);

const teacher1 = getTeacherById('T001');

const DEMO_ACCOUNTS = [
  { email: 'admin@clinx.uk', password: 'demo', role: 'siteAdmin', name: 'Clinx Admin', teacherId: null },
  { email: 'head@dedworth.school', password: 'demo', role: 'schoolAdmin', name: 'Mrs. J. Whitfield (Headteacher)', teacherId: null },
  { email: 'dsl@dedworth.school', password: 'demo', role: 'schoolAdmin', name: 'Mr. P. Hargreaves (DSL)', teacherId: null },
  { email: 't.smith@dedworth.school', password: 'demo', role: 'teacher', name: teacher1?.name || 'Mr. T. Smith', teacherId: 'T001' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(email, password) {
    const account = DEMO_ACCOUNTS.find(a => a.email === email && a.password === password);
    if (account) {
      setUser({ ...account });
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
