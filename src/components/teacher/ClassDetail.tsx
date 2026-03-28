import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getClassById, getPupilsByIds } from '../../services/dataService';
import PupilTable from '../pupils/PupilTable';
import type { RouteBasePath } from '../../types/domain';

type ClassDetailProps = {
  basePath?: RouteBasePath;
  backPath?: string;
  backLabel?: string;
};

export default function ClassDetail({
  basePath = '/teacher',
  backPath = '/teacher',
  backLabel = 'Back to My Classes',
}: ClassDetailProps) {
  const { id, teacherId } = useParams();
  const navigate = useNavigate();
  const cls = getClassById(id);
  const resolvedBackPath = teacherId ? `/dashboard/staff/${teacherId}` : backPath;

  if (!cls) return <p className="text-gray-500">Class not found</p>;

  const pupils = getPupilsByIds(cls.pupils);

  return (
    <div className="max-w-7xl space-y-4">
      <button
        onClick={() => navigate(resolvedBackPath)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-sky-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {backLabel}
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

      <PupilTable basePath={basePath} pupils={pupils} />
    </div>
  );
}
