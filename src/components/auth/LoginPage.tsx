import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Building2, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import type { DemoAccount, UserRole } from '../../types/domain';

const routesByRole: Record<UserRole, string> = {
  siteAdmin: '/admin',
  schoolAdmin: '/dashboard',
  teacher: '/teacher',
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, DEMO_ACCOUNTS } = useAuth();
  const { getSchoolById } = useAdminData();
  const navigate = useNavigate();
  const clinxAccounts = DEMO_ACCOUNTS.filter((account) => account.role === 'siteAdmin');
  const schoolAccounts = DEMO_ACCOUNTS.filter((account) => account.role !== 'siteAdmin');
  const schoolDemoGroups = Object.values(
    schoolAccounts.reduce<Record<string, { schoolName: string; accounts: DemoAccount[] }>>(
      (groups, account) => {
        const key = account.schoolId || account.email;
        const school = account.schoolId ? getSchoolById(account.schoolId) : undefined;
        if (!groups[key]) {
          groups[key] = {
            schoolName: school?.name || 'School Demo',
            accounts: [],
          };
        }
        groups[key].accounts.push(account);
        return groups;
      },
      {},
    ),
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const result = login(email, password);
    if (result.success) {
      navigate(routesByRole[result.role] || '/');
      return;
    }

    setError('error' in result ? result.error : 'Unable to sign in');
  }

  function quickLogin(account: DemoAccount) {
    setEmail(account.email);
    setPassword(account.password);

    const result = login(account.email, account.password);
    if (result.success) {
      navigate(routesByRole[result.role] || '/');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-5xl px-6">
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 mb-2 mx-auto hover:opacity-85 transition-opacity"
          >
            <Shield className="w-10 h-10 text-sky-600" />
            <span className="text-2xl font-bold text-sky-700">Clinx</span>
          </button>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        <div className="grid grid-cols-[1.1fr_0.9fr] gap-6 items-start">
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow text-sm"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow text-sm pr-10"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-2.5 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate('/?request-demo=1')}
                  className="w-full py-2.5 border border-sky-200 text-sky-700 rounded-lg font-medium hover:bg-sky-50 transition-colors"
                >
                  Request Demo Access
                </button>
              </div>
            </div>

            {clinxAccounts.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Internal Clinx Access</p>
                    <p className="text-sm text-gray-500 mt-1">
                      For internal onboarding, support, and platform oversight conversations only.
                    </p>
                  </div>
                </div>
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  {clinxAccounts.map((account) => (
                    <button
                      key={account.email}
                      onClick={() => quickLogin(account)}
                      className="w-full text-left px-3 py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-700">{account.name}</p>
                        <p className="text-xs text-gray-400">{account.email}</p>
                      </div>
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        Clinx Admin
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-800">School Demo Access</p>
              <p className="text-sm text-sky-900 mt-2">
                The logins below are sample roles inside a demo school environment. They are provided to help schools
                see how Clinx works in practice and are not live customer accounts.
              </p>
              <p className="text-sm text-sky-800 mt-2">
                For the clearest demo flow, start with the school admin login and then move to the teacher login.
              </p>
            </div>

            {schoolDemoGroups.map((group, index) => (
              <div key={group.schoolName} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        School Demo Logins
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{group.schoolName}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Demonstration logins for leadership and teacher journeys inside one school environment.
                      </p>
                    </div>
                  </div>
                  {index === 0 && (
                    <span className="text-xs bg-sky-100 text-sky-700 px-2.5 py-1 rounded-full font-medium shrink-0">
                      Recommended start
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {group.accounts.map((account) => (
                    <button
                      key={account.email}
                      onClick={() => quickLogin(account)}
                      className="w-full text-left px-3 py-3 rounded-lg hover:bg-sky-50 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-700">{account.name}</p>
                        <p className="text-xs text-gray-400">{account.email}</p>
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-medium capitalize">
                        {account.role === 'schoolAdmin' ? 'School Login' : 'Teacher Login'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}
