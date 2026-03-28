import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, KeyRound, Mail, Pencil, ShieldCheck, UserCog, XCircle } from 'lucide-react';
import {
  useAdminData,
  type SchoolSupportAccount,
  type SupportAccountStatus,
} from '../../context/AdminDataContext';
import { useToast } from '../common/Toast';

type AccountFormState = {
  email: string;
  status: SupportAccountStatus;
};

export default function SchoolSupportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { getSchoolById, updateSupportAccount, suspendSupportAccount, reactivateSupportAccount } = useAdminData();

  const school = getSchoolById(id || '');

  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [form, setForm] = useState<AccountFormState>({ email: '', status: 'Active' });
  const [pendingSuspend, setPendingSuspend] = useState<SchoolSupportAccount | null>(null);

  const accounts = school?.accounts ?? [];
  const editingAccount = useMemo(
    () => accounts.find((account) => account.id === editingAccountId) || null,
    [accounts, editingAccountId],
  );

  function openEdit(account: SchoolSupportAccount) {
    setEditingAccountId(account.id);
    setForm({
      email: account.email,
      status: account.status,
    });
  }

  function closeEdit() {
    setEditingAccountId(null);
    setForm({ email: '', status: 'Active' });
  }

  function saveAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!school || !editingAccountId) return;

    updateSupportAccount(school.id, editingAccountId, {
      email: form.email.trim(),
      status: form.status,
    });

    addToast('Account details updated', 'success');
    closeEdit();
  }

  function sendResetLink(account: SchoolSupportAccount) {
    addToast(`Password reset link sent to ${account.email}`, 'success');
  }

  function resendInvite(account: SchoolSupportAccount) {
    addToast(`Invite resent to ${account.email}`, 'success');
  }

  function suspendAccount(account: SchoolSupportAccount) {
    if (!school) return;
    suspendSupportAccount(school.id, account.id);
    addToast(`${account.name} has been suspended`, 'warning');
  }

  function reactivateAccount(account: SchoolSupportAccount) {
    if (!school) return;
    reactivateSupportAccount(school.id, account.id);
    addToast(`${account.name} has been reactivated`, 'success');
  }

  if (!school) {
    return (
      <div className="max-w-4xl space-y-4">
        <button
          onClick={() => navigate('/admin/schools')}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-sky-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Schools
        </button>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900">School not found</h1>
          <p className="text-sm text-gray-500 mt-2">
            This school could not be loaded from the Clinx admin workspace.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6">
      <button
        onClick={() => navigate('/admin/schools')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-sky-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Schools
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{school.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{school.location}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Account Support Owner</p>
            <p className="text-sm font-medium text-gray-700 mt-1">{school.supportOwner}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">User Accounts</p>
          <p className="text-3xl font-bold text-gray-900 mt-3">{accounts.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Active</p>
          <p className="text-3xl font-bold text-emerald-700 mt-3">
            {accounts.filter((account) => account.status === 'Active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Invited</p>
          <p className="text-3xl font-bold text-sky-700 mt-3">
            {accounts.filter((account) => account.status === 'Invited').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Support Actions</p>
          <p className="text-3xl font-bold text-violet-700 mt-3">Email</p>
          <p className="text-sm text-gray-500 mt-1">
            Edit accounts, resend invites, and support password resets
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">School Accounts</h2>
            <p className="text-sm text-gray-500 mt-1">
              Clinx admin support tools for this organisation&apos;s staff accounts
            </p>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Classes</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Source</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Last Access</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Support</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {accounts.map((account) => (
              <tr key={account.id}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{account.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{account.role}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{account.email}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{account.classes}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      account.source === 'Synced' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {account.source}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      account.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : account.status === 'Invited'
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {account.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{account.lastAccess}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(account)}
                      className="p-1.5 text-gray-400 hover:text-sky-600 rounded"
                      title="Edit account"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => sendResetLink(account)}
                      className="p-1.5 text-gray-400 hover:text-violet-600 rounded"
                      title="Send reset link"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                    {account.status === 'Invited' ? (
                      <button
                        onClick={() => resendInvite(account)}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 rounded"
                        title="Resend invite"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    ) : account.status === 'Suspended' ? (
                      <button
                        onClick={() => reactivateAccount(account)}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 rounded"
                        title="Reactivate account"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setPendingSuspend(account)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                        title="Suspend account"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Security Support
          </h3>
          <p className="text-sm text-gray-600">
            Reset passwords, resend invites, and suspend access without needing the school to manage platform-level
            support tickets.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <UserCog className="w-4 h-4 text-sky-600" />
            Account Hygiene
          </h3>
          <p className="text-sm text-gray-600">
            Keep staff emails current and quickly spot invited or suspended users during rollout and post-launch
            support.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Mail className="w-4 h-4 text-violet-600" />
            Escalation Path
          </h3>
          <p className="text-sm text-gray-600">
            Use this view for Clinx support actions only, while schools continue to own local staffing and
            safeguarding decisions.
          </p>
        </div>
      </div>

      {editingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Edit Account</h3>
                <p className="text-sm text-gray-500 mt-1">{editingAccount.name}</p>
              </div>
              <button onClick={closeEdit} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, status: event.target.value as SupportAccountStatus }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  <option>Active</option>
                  <option>Invited</option>
                  <option>Suspended</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white text-sm rounded-lg hover:bg-sky-700">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pendingSuspend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900">Deactivate Account?</h3>
            <p className="text-sm text-gray-600 mt-3">
              Are you sure you wish to deactivate {pendingSuspend.name}&apos;s account?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              They will no longer be able to access Clinx until the account is reactivated by a Clinx admin.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setPendingSuspend(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  suspendAccount(pendingSuspend);
                  setPendingSuspend(null);
                }}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
