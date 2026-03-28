import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { login, DEMO_ACCOUNTS } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const result = login(email, password);
    if (result.success) {
      const routes = { siteAdmin: '/admin', schoolAdmin: '/dashboard', teacher: '/teacher' };
      navigate(routes[result.role] || '/');
    } else {
      setError(result.error);
    }
  }

  function quickLogin(account) {
    setEmail(account.email);
    setPassword(account.password);
    const result = login(account.email, account.password);
    if (result.success) {
      const routes = { siteAdmin: '/admin', schoolAdmin: '/dashboard', teacher: '/teacher' };
      navigate(routes[result.role] || '/');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-10 h-10 text-sky-600" />
            <span className="text-2xl font-bold text-sky-700">Clinx</span>
          </div>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow text-sm"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow text-sm pr-10"
                  placeholder="••••••"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-2.5 text-gray-400">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
        </div>

        {/* Demo accounts */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Demo Accounts</p>
          <div className="space-y-2">
            {DEMO_ACCOUNTS.map(a => (
              <button
                key={a.email}
                onClick={() => quickLogin(a)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-sky-50 transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700">{a.name}</p>
                  <p className="text-xs text-gray-400">{a.email}</p>
                </div>
                <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded font-medium capitalize">
                  {a.role === 'siteAdmin' ? 'Site Admin' : a.role === 'schoolAdmin' ? 'School Admin' : 'Teacher'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
