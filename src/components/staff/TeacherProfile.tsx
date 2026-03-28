import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, AlertTriangle, BookOpen } from 'lucide-react';
import { getTeacherById, getClassesForTeacher, getPupilsByIds } from '../../services/dataService';
import RiskBadge from '../common/RiskBadge';

type ClassSummary = {
  id: string;
  name: string;
  subject: string;
  room: string;
  pupilCount: number;
  avgRiskScore: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  avgAttendance: number;
};

export default function TeacherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const teacher = getTeacherById(id);

  const classSummaries = useMemo<ClassSummary[]>(() => {
    if (!teacher) {
      return [];
    }

    return getClassesForTeacher(teacher.id).map((schoolClass) => {
      const pupils = getPupilsByIds(schoolClass.pupils);
      const pupilCount = pupils.length;
      const totalRiskScore = pupils.reduce((sum, pupil) => sum + pupil.riskScore, 0);
      const totalAttendance = pupils.reduce((sum, pupil) => sum + pupil.attendance, 0);

      return {
        id: schoolClass.id,
        name: schoolClass.name,
        subject: schoolClass.subject,
        room: schoolClass.room,
        pupilCount,
        avgRiskScore: pupilCount ? Math.round(totalRiskScore / pupilCount) : 0,
        highRiskCount: pupils.filter((pupil) => pupil.riskLevel === 'High').length,
        mediumRiskCount: pupils.filter((pupil) => pupil.riskLevel === 'Medium').length,
        lowRiskCount: pupils.filter((pupil) => pupil.riskLevel === 'Low').length,
        avgAttendance: pupilCount ? Math.round((totalAttendance / pupilCount) * 10) / 10 : 0,
      };
    });
  }, [teacher]);

  if (!teacher) {
    return <p className="text-gray-500">Teacher not found</p>;
  }

  const totals = classSummaries.reduce(
    (acc, item) => {
      acc.classCount += 1;
      acc.pupilCount += item.pupilCount;
      acc.highRiskCount += item.highRiskCount;
      acc.mediumRiskCount += item.mediumRiskCount;
      acc.lowRiskCount += item.lowRiskCount;
      acc.totalRiskScore += item.avgRiskScore * item.pupilCount;
      acc.totalAttendance += item.avgAttendance * item.pupilCount;
      return acc;
    },
    {
      classCount: 0,
      pupilCount: 0,
      highRiskCount: 0,
      mediumRiskCount: 0,
      lowRiskCount: 0,
      totalRiskScore: 0,
      totalAttendance: 0,
    },
  );

  const overallRiskScore = totals.pupilCount ? Math.round(totals.totalRiskScore / totals.pupilCount) : 0;
  const overallAttendance = totals.pupilCount ? Math.round((totals.totalAttendance / totals.pupilCount) * 10) / 10 : 0;
  const overallRiskLevel = overallRiskScore > 75 ? 'High' : overallRiskScore >= 50 ? 'Medium' : 'Low';

  return (
    <div className="max-w-7xl space-y-6">
      <button
        onClick={() => navigate('/dashboard/staff')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-sky-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Staff
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm text-gray-500">Teacher Profile</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{teacher.name}</h1>
            <p className="text-sm text-gray-500 mt-2">{teacher.email}</p>
            <p className="text-sm text-gray-500">{teacher.subjects.join(', ')}</p>
            {teacher.formTutor && (
              <p className="text-sm text-gray-500">Form Tutor: {teacher.formTutor}</p>
            )}
          </div>
          <div className="shrink-0">
            <RiskBadge level={overallRiskLevel} score={overallRiskScore} size="lg" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Classes</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totals.classCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">Pupils</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totals.pupilCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">High Risk Pupils</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{totals.highRiskCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-2">Average Attendance</p>
          <p className="text-2xl font-bold text-gray-900">{overallAttendance}%</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Class Wellbeing Summary</h2>
          <p className="text-sm text-gray-500 mt-1">Overview of each class taught by this teacher</p>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Room</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Pupils</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Average Risk</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Attendance</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Risk Split</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {classSummaries.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-sky-50/40 cursor-pointer transition-colors"
                onClick={() => navigate(`/dashboard/staff/${teacher.id}/class/${item.id}`)}
              >
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.subject}</p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.room}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.pupilCount}</td>
                <td className="px-4 py-3">
                  <RiskBadge
                    level={item.avgRiskScore > 75 ? 'High' : item.avgRiskScore >= 50 ? 'Medium' : 'Low'}
                    score={item.avgRiskScore}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.avgAttendance}%</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <span className="text-red-600 font-medium">{item.highRiskCount}</span> high,{' '}
                  <span className="text-amber-600 font-medium">{item.mediumRiskCount}</span> medium,{' '}
                  <span className="text-emerald-600 font-medium">{item.lowRiskCount}</span> low
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
