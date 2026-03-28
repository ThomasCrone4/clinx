import { useState } from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { getNotesForPupil, addNoteForPupil } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

export default function NotesTab({ pupil }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState(getNotesForPupil(pupil.id));
  const [newNote, setNewNote] = useState('');
  const [showForm, setShowForm] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!newNote.trim()) return;
    addNoteForPupil(pupil.id, user.name, newNote.trim());
    setNotes(getNotesForPupil(pupil.id));
    setNewNote('');
    setShowForm(false);
  }

  function formatDate(ts) {
    const d = new Date(ts);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">Staff Notes ({notes.length})</h4>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 text-white text-sm rounded-lg hover:bg-sky-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Note
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4">
          <textarea
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            placeholder="Enter your note..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-none"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1.5 bg-sky-600 text-white text-sm rounded-lg hover:bg-sky-700">
              Save Note
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No notes yet</p>
          </div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-700">{note.author}</span>
                <span className="text-xs text-gray-400">{formatDate(note.timestamp)}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{note.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
