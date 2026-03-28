import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getTeacherById, getClassById, getPupilsByIds, getPeriods, getDays } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

export default function CalendarView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [weekOffset, setWeekOffset] = useState(0);

  const teacher = getTeacherById(user?.teacherId);
  const periods = getPeriods();
  const days = getDays();

  const classRiskMap = useMemo(() => {
    const map: Record<string, { high: number; medium: number }> = {};
    if (!teacher) return map;

    for (const day of days) {
      for (const slot of teacher.timetable[day] || []) {
        if (!slot) continue;

        const schoolClass = getClassById(slot.classId);
        if (schoolClass && !map[slot.classId]) {
          const pupils = getPupilsByIds(schoolClass.pupils);
          map[slot.classId] = {
            high: pupils.filter((pupil) => pupil.riskLevel === 'High').length,
            medium: pupils.filter((pupil) => pupil.riskLevel === 'Medium').length,
          };
        }
      }
    }

    return map;
  }, [days, teacher]);

  if (!teacher) {
    return <p className="text-gray-500">Teacher data not available</p>;
  }

  const baseDate = new Date('2026-03-23');
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);
  const weekLabel = `Week of ${baseDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  return (
    <div className="space-y-4 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
          <p className="text-sm text-gray-500 mt-1">{teacher.name} - {teacher.subjects.join(', ')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset((value) => value - 1)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setWeekOffset(0)} className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">
            Current Week
          </button>
          <button onClick={() => setWeekOffset((value) => value + 1)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500 ml-2">{weekLabel}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-24 px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-left">Time</th>
              {days.map((day) => (
                <th key={day} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-left">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {periods.map((period, periodIndex) => (
              <tr key={period.id}>
                <td className="px-4 py-1 text-xs text-gray-400 align-top pt-3">
                  <div className="font-medium">{period.label}</div>
                  <div>{period.start}-{period.end}</div>
                </td>
                {days.map((day) => {
                  const slot = teacher.timetable[day]?.[periodIndex];
                  if (!slot) {
                    return (
                      <td key={day} className="px-2 py-1">
                        <div className="h-16" />
                      </td>
                    );
                  }

                  const risks = classRiskMap[slot.classId] || { high: 0, medium: 0 };
                  return (
                    <td key={day} className="px-2 py-1">
                      <button
                        onClick={() => navigate(`/teacher/class/${slot.classId}`)}
                        className="w-full h-16 bg-sky-50 border border-sky-200 rounded-lg p-2 text-left hover:bg-sky-100 hover:border-sky-300 transition-colors"
                      >
                        <p className="text-xs font-semibold text-sky-800 truncate">{slot.className}</p>
                        <p className="text-xs text-sky-600 truncate">{slot.room}</p>
                        <div className="flex gap-1 mt-1">
                          {risks.high > 0 && (
                            <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0 rounded-full font-medium">
                              High: {risks.high}
                            </span>
                          )}
                          {risks.medium > 0 && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0 rounded-full font-medium">
                              Medium: {risks.medium}
                            </span>
                          )}
                        </div>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
