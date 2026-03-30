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

      <PupilTable
        basePath={basePath}
        pupils={pupils}
        title={cls.name}
        description={null}
        headerContent={
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Teacher</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">{cls.teacherName}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Room</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">{cls.room}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Class Size</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">{`${pupils.length} pupils in this class`}</p>
            </div>
          </div>
        }
        hideYearFilter
      />
    </div>
  );
}
