import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getClassById, getPupilsByIds } from '../../services/dataService';
import PupilTable from '../pupils/PupilTable';

export default function ClassDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cls = getClassById(id);

  if (!cls) return <p className="text-gray-500">Class not found</p>;

  const pupils = getPupilsByIds(cls.pupils);

  return (
    <div className="max-w-7xl space-y-4">
      <button
        onClick={() => navigate('/teacher')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-sky-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Classes
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs">Class</p>
            <p className="font-semibold text-gray-900">{cls.name}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Subject</p>
            <p className="font-medium text-gray-700">{cls.subject}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Teacher</p>
            <p className="font-medium text-gray-700">{cls.teacherName}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Room</p>
            <p className="font-medium text-gray-700">{cls.room}</p>
          </div>
        </div>
      </div>

      <PupilTable basePath="/teacher" pupils={pupils} />
    </div>
  );
}
