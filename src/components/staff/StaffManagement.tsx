import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { getAllTeachers } from '../../services/dataService';
import { useToast } from '../common/Toast';

export default function StaffManagement() {
  const teachers = getAllTeachers();
  const { addToast } = useToast();
  const [showModal, setShowModal] = useState(false);

  const staff = [
    { name: 'Mrs. J. Whitfield', role: 'Headteacher', email: 'head@dedworth.school', classes: '—', status: 'Active' },
    { name: 'Mr. P. Hargreaves', role: 'DSL', email: 'dsl@dedworth.school', classes: '—', status: 'Active' },
    ...teachers.map(t => ({
      name: t.name,
      role: 'Teacher',
      email: t.email,
      classes: `${t.classes.length} classes`,
      status: 'Active',
    })),
  ];

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
          <p className="text-sm text-gray-500 mt-1">{staff.length} staff members</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white text-sm rounded-lg font-medium hover:bg-sky-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Classes</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {staff.map((s, i) => (
              <tr key={i} className="hover:bg-gray-50/50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{s.role}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{s.email}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{s.classes}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{s.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => addToast('Edit modal would open', 'info')} className="p-1.5 text-gray-400 hover:text-sky-600 rounded">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => addToast('Staff member would be removed', 'warning')} className="p-1.5 text-gray-400 hover:text-red-500 rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Staff Member</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                addToast('Staff member added successfully', 'success');
                setShowModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Mr. J. Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none" placeholder="j.doe@dedworth.school" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none">
                  <option>Teacher</option>
                  <option>School Admin</option>
                  <option>Teaching Assistant</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white text-sm rounded-lg hover:bg-sky-700">Add Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
