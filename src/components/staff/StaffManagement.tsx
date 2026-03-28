import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, RefreshCw, UserPlus } from 'lucide-react';
import { getAllTeachers } from '../../services/dataService';
import { useToast } from '../common/Toast';
import type { Teacher } from '../../types/domain';

type StaffRole = 'Teacher' | 'School Admin' | 'Teaching Assistant' | 'Pastoral Lead';
type StaffStatus = 'Active' | 'Inactive';
type StaffSource = 'Synced' | 'Manual';

type StaffRow = {
  id: string;
  linkedTeacherId?: string;
  name: string;
  role: StaffRole;
  email: string;
  classes: string;
  status: StaffStatus;
  source: StaffSource;
  clickable: boolean;
};

type StaffFormState = {
  name: string;
  email: string;
  role: StaffRole;
  source: StaffSource;
  status: StaffStatus;
};

const emptyForm: StaffFormState = {
  name: '',
  email: '',
  role: 'Teacher',
  source: 'Manual',
  status: 'Active',
};

function makeManualId() {
  return `manual-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function StaffManagement() {
  const teachers = getAllTeachers();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const initialStaff = useMemo<StaffRow[]>(
    () => [
        {
          id: 'staff-headteacher',
          name: 'Mr Brad Day',
          role: 'School Admin',
          email: 'b.day@dedworth.school',
          classes: '-',
          status: 'Active',
          source: 'Manual',
        clickable: false,
      },
      {
        id: 'staff-dsl',
        name: 'Mr. P. Hargreaves',
        role: 'Pastoral Lead',
        email: 'dsl@dedworth.school',
        classes: '-',
        status: 'Active',
        source: 'Manual',
        clickable: false,
      },
      ...teachers.map((teacher: Teacher) => ({
        id: `staff-${teacher.id}`,
        linkedTeacherId: teacher.id,
        name: teacher.name,
        role: 'Teacher' as const,
        email: teacher.email,
        classes: `${teacher.classes.length} classes`,
        status: 'Active' as const,
        source: 'Synced' as const,
        clickable: true,
      })),
    ],
    [teachers],
  );

  const [staff, setStaff] = useState<StaffRow[]>(initialStaff);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<StaffFormState>(emptyForm);

  const activeCount = staff.filter((member) => member.status === 'Active').length;
  const syncedCount = staff.filter((member) => member.source === 'Synced').length;
  const manualCount = staff.filter((member) => member.source === 'Manual').length;

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEditModal(member: StaffRow) {
    setEditingId(member.id);
    setForm({
      name: member.name,
      email: member.email,
      role: member.role,
      source: member.source,
      status: member.status,
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      addToast('Please complete name and email before saving', 'warning');
      return;
    }

    if (editingId) {
      setStaff((prev) =>
        prev.map((member) =>
          member.id === editingId
            ? {
                ...member,
                name: form.name.trim(),
                email: form.email.trim(),
                role: form.role,
                source: form.source,
                status: form.status,
                clickable: Boolean(member.linkedTeacherId) && form.status === 'Active',
              }
            : member,
        ),
      );
      addToast('Staff record updated', 'success');
    } else {
      setStaff((prev) => [
        {
          id: makeManualId(),
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          classes: form.role === 'Teacher' ? 'Manual record' : '-',
          status: form.status,
          source: form.source,
          clickable: false,
        },
        ...prev,
      ]);
      addToast('Staff member added', 'success');
    }

    closeModal();
  }

  function handleDelete(member: StaffRow) {
    setStaff((prev) => prev.filter((item) => item.id !== member.id));
    addToast(`${member.name} removed from this school view`, 'warning');
  }

  function handleDeactivate(member: StaffRow) {
    setStaff((prev) =>
      prev.map((item) =>
        item.id === member.id
          ? {
              ...item,
              status: 'Inactive',
              clickable: false,
            }
          : item,
      ),
    );
    addToast(`${member.name} marked inactive`, 'info');
  }

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
          <p className="text-sm text-gray-500 mt-1">Manage Clinx-visible staff while keeping synced records as the main source of truth.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white text-sm rounded-lg font-medium hover:bg-sky-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Active Staff</p>
          <p className="text-3xl font-bold text-gray-900 mt-3">{activeCount}</p>
          <p className="text-sm text-gray-500 mt-1">Currently visible in Clinx workflows</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Synced Records</p>
          <p className="text-3xl font-bold text-sky-700 mt-3">{syncedCount}</p>
          <p className="text-sm text-gray-500 mt-1">Prefer data from MIS or timetable feeds where possible</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Manual Overrides</p>
          <p className="text-3xl font-bold text-amber-700 mt-3">{manualCount}</p>
          <p className="text-sm text-gray-500 mt-1">Useful for temporary or non-synced staff</p>
        </div>
      </div>

      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3">
        <RefreshCw className="w-4 h-4 text-sky-700 mt-0.5 shrink-0" />
        <div className="text-sm text-sky-800">
          Teacher records should usually come from existing school systems. Use manual entries for exceptions, temporary
          staff, or Clinx-specific visibility changes rather than as a separate HR system.
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Classes</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Source</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {staff.map((member) => (
              <tr
                key={member.id}
                className={member.clickable ? 'hover:bg-sky-50/50 cursor-pointer transition-colors' : 'hover:bg-gray-50/50'}
                onClick={() => member.linkedTeacherId && member.status === 'Active' && navigate(`/dashboard/staff/${member.linkedTeacherId}`)}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {member.clickable ? <span className="text-sky-700 hover:underline">{member.name}</span> : member.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{member.role}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{member.email}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{member.classes}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      member.source === 'Synced' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {member.source}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      member.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {member.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        openEditModal(member);
                      }}
                      className="p-1.5 text-gray-400 hover:text-sky-600 rounded"
                      title="Edit staff"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {member.status === 'Active' && (
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeactivate(member);
                        }}
                        className="p-1.5 text-gray-400 hover:text-amber-600 rounded"
                        title="Deactivate staff"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(member);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                      title="Delete staff"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {editingId
                    ? 'Update Clinx-specific visibility and contact details.'
                    : 'Create a manual or temporary staff record for this school.'}
                </p>
              </div>
              <button onClick={closeModal}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="Mr. J. Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="j.doe@dedworth.school"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={form.role}
                    onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as StaffRole }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  >
                    <option>Teacher</option>
                    <option>School Admin</option>
                    <option>Teaching Assistant</option>
                    <option>Pastoral Lead</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <select
                    value={form.source}
                    onChange={(event) => setForm((prev) => ({ ...prev, source: event.target.value as StaffSource }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  >
                    <option>Manual</option>
                    <option>Synced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as StaffStatus }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <UserPlus className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                  <span>
                    In production, most teacher records would come from MIS or timetable feeds. This screen is for
                    exceptions, temporary staff, or Clinx-specific access changes.
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white text-sm rounded-lg hover:bg-sky-700">
                  {editingId ? 'Save Changes' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
