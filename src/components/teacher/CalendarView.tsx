import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Brain,
  BookOpen,
  ArrowRight,
  Clock3,
  CheckCircle2,
  Eye,
  ClipboardList,
  BellRing,
  Mail,
  SlidersHorizontal,
} from 'lucide-react';
import { getTeacherById, getClassById, getPupilsByIds, getPeriods, getDays } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../common/Toast';
import RiskBadge from '../common/RiskBadge';
import type { TeacherActionStatus, TeacherAlertDelivery, TeacherAlertPreferences } from '../../types/domain';
import { getPupilPrimaryLabel } from '../../utils/pupilDisplay';

export default function CalendarView() {
  const { user } = useAuth();
  const { teacherActions, setTeacherAction, getTeacherAlertPreferences, updateTeacherAlertPreferences } = useAppData();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const [weekOffset, setWeekOffset] = useState(0);
  const alertPreferencesRef = useRef<HTMLDivElement | null>(null);

  const teacher = getTeacherById(user?.teacherId);
  const periods = getPeriods();
  const days = getDays();
  const alertPreferences = getTeacherAlertPreferences(user?.teacherId);

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

  const teacherClasses = useMemo(() => {
    if (!teacher) return [];
    const seen = new Set<string>();

    return days
      .flatMap((day) => teacher.timetable[day] || [])
      .filter((slot): slot is NonNullable<typeof slot> => Boolean(slot))
      .filter((slot) => {
        if (seen.has(slot.classId)) return false;
        seen.add(slot.classId);
        return true;
      })
      .map((slot) => getClassById(slot.classId))
      .filter((schoolClass): schoolClass is NonNullable<typeof schoolClass> => Boolean(schoolClass));
  }, [days, teacher]);

  const taughtPupils = useMemo(() => {
    const ids = new Set<string>();
    teacherClasses.forEach((schoolClass) => {
      schoolClass.pupils.forEach((pupilId) => ids.add(pupilId));
    });
    return getPupilsByIds([...ids]).sort((a, b) => b.riskScore - a.riskScore);
  }, [teacherClasses]);

  const topPriorityPupils = taughtPupils.slice(0, 5);
  const highRiskCount = taughtPupils.filter((pupil) => pupil.riskLevel === 'High').length;
  const mediumRiskCount = taughtPupils.filter((pupil) => pupil.riskLevel === 'Medium').length;
  const averageAttendance =
    taughtPupils.length > 0
      ? Math.round((taughtPupils.reduce((sum, pupil) => sum + pupil.attendance, 0) / taughtPupils.length) * 10) / 10
      : 0;

  const atRiskClasses = teacherClasses
    .map((schoolClass) => ({
      id: schoolClass.id,
      name: schoolClass.name,
      subject: schoolClass.subject,
      high: classRiskMap[schoolClass.id]?.high || 0,
      medium: classRiskMap[schoolClass.id]?.medium || 0,
    }))
    .sort((a, b) => b.high * 2 + b.medium - (a.high * 2 + a.medium))
    .slice(0, 3);

  const priorityQueue = topPriorityPupils.map((pupil) => ({
    pupil,
    status: teacherActions[pupil.id] || 'New',
  }));
  const followUpCount = priorityQueue.filter((item) => item.status === 'Follow Up Planned').length;
  const monitoringCount = priorityQueue.filter((item) => item.status === 'Monitoring').length;

  const actionOptions: TeacherActionStatus[] = ['Acknowledged', 'Monitoring', 'Follow Up Planned'];
  const deliveryOptions: TeacherAlertDelivery[] = ['Immediate', 'Daily Digest'];

  useEffect(() => {
    if (location.hash === '#alert-preferences' && alertPreferencesRef.current) {
      alertPreferencesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  function saveTeacherAlertPreference(updates: Partial<TeacherAlertPreferences>) {
    updateTeacherAlertPreferences(user?.teacherId, updates);
    addToast('Alert preferences saved', 'success');
  }

  if (!teacher) {
    return <p className="text-gray-500">Teacher data not available</p>;
  }

  const baseDate = new Date('2026-03-23');
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);
  const weekLabel = `Week of ${baseDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;

  return (
    <div className="space-y-4 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
          <p className="text-sm text-gray-500 mt-1">{teacher.name} - {teacher.subjects.join(', ')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset((value) => value - 1)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Current Week
          </button>
          <button
            onClick={() => setWeekOffset((value) => value + 1)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500 ml-2">{weekLabel}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Pupils Taught',
            value: taughtPupils.length,
            icon: BookOpen,
            tone: 'text-sky-700',
            bg: 'bg-sky-50 border-sky-200',
          },
          {
            label: 'High Risk Pupils',
            value: highRiskCount,
            icon: AlertTriangle,
            tone: 'text-red-700',
            bg: 'bg-red-50 border-red-200',
          },
          {
            label: 'Medium Risk Pupils',
            value: mediumRiskCount,
            icon: Brain,
            tone: 'text-amber-700',
            bg: 'bg-amber-50 border-amber-200',
          },
          {
            label: 'Avg Attendance',
            value: `${averageAttendance}%`,
            icon: Clock3,
            tone: 'text-emerald-700',
            bg: 'bg-emerald-50 border-emerald-200',
          },
        ].map((item) => (
          <div key={item.label} className={`rounded-2xl border p-4 ${item.bg}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
              <item.icon className={`w-4 h-4 ${item.tone}`} />
            </div>
            <p className={`text-3xl font-bold mt-3 ${item.tone}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1.7fr_1fr] gap-6 items-start">
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-600 rounded-2xl p-6 text-white">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">Teacher Overview</p>
                <h2 className="text-2xl font-bold mt-2">Who needs attention first?</h2>
                <p className="text-sm text-sky-50/90 mt-2 max-w-2xl">
                  Clinx is highlighting pupils across your classes whose current signals most closely resemble patterns
                  that previously led to later concerns, so you can prioritise support without digging through multiple
                  systems.
                </p>
              </div>
              <button
                onClick={() => navigate('/teacher/alerts')}
                className="shrink-0 rounded-xl bg-white/15 px-4 py-2 text-sm font-medium hover:bg-white/20 transition-colors"
              >
                View Alerts
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Weekly Timetable</h2>
                <p className="text-sm text-gray-500 mt-1">Class risk indicators are shown directly in each lesson slot.</p>
              </div>
            </div>
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
                      <div>
                        {period.start}-{period.end}
                      </div>
                    </td>
                    {days.map((day) => {
                      const slot = teacher.timetable[day]?.[periodIndex];
                      if (!slot) {
                        return (
                          <td key={day} className="px-2 py-1">
                            <div className="h-20 rounded-lg bg-gray-50/70" />
                          </td>
                        );
                      }

                      const risks = classRiskMap[slot.classId] || { high: 0, medium: 0 };
                      return (
                        <td key={day} className="px-2 py-1">
                          <button
                            onClick={() => navigate(`/teacher/class/${slot.classId}`)}
                            className="w-full h-20 bg-sky-50 border border-sky-200 rounded-xl px-3 py-2 text-left hover:bg-sky-100 hover:border-sky-300 transition-colors flex flex-col justify-between overflow-hidden"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-sky-900 truncate">{slot.className}</p>
                              <p className="text-xs text-sky-700 truncate">{slot.subject} - {slot.room}</p>
                            </div>
                            <div className="min-w-0">
                              {risks.high > 0 || risks.medium > 0 ? (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {risks.high > 0 && (
                                    <span className="text-[11px] leading-none bg-red-100 text-red-700 px-1.5 py-1 rounded-full font-medium">
                                      H {risks.high}
                                    </span>
                                  )}
                                  {risks.medium > 0 && (
                                    <span className="text-[11px] leading-none bg-amber-100 text-amber-700 px-1.5 py-1 rounded-full font-medium">
                                      M {risks.medium}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[11px] leading-none bg-emerald-100 text-emerald-700 px-1.5 py-1 rounded-full font-medium inline-flex">
                                  Stable
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

        <div className="space-y-4">
          <div ref={alertPreferencesRef} id="alert-preferences" className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">My Alert Preferences</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Choose the alert style that suits how you work, without adding extra admin.
                </p>
              </div>
              <SlidersHorizontal className="w-5 h-5 text-sky-600" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  Delivery Timing
                </label>
                <div className="flex bg-slate-100 rounded-lg p-1">
                  {deliveryOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => saveTeacherAlertPreference({ delivery: option })}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        alertPreferences.delivery === option ? 'bg-white text-sky-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    label: 'Show in-app alerts',
                    description: 'See concerns inside Clinx while working through your classes.',
                    checked: alertPreferences.inApp,
                    icon: BellRing,
                    onChange: (checked: boolean) => saveTeacherAlertPreference({ inApp: checked }),
                  },
                  {
                    label: 'Email me a summary',
                    description: 'Receive a low-noise summary rather than relying only on the app.',
                    checked: alertPreferences.emailDigest,
                    icon: Mail,
                    onChange: (checked: boolean) => saveTeacherAlertPreference({ emailDigest: checked }),
                  },
                  {
                    label: 'Only notify me about high-priority concerns',
                    description: 'Keep Clinx focused on the pupils most likely to need your attention first.',
                    checked: alertPreferences.highPriorityOnly,
                    icon: AlertTriangle,
                    onChange: (checked: boolean) => saveTeacherAlertPreference({ highPriorityOnly: checked }),
                  },
                ].map((item) => (
                  <label key={item.label} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(event) => item.onChange(event.target.checked)}
                      className="mt-0.5 w-4 h-4 text-sky-600 rounded border-gray-300 focus:ring-sky-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-800">{item.label}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="rounded-xl bg-sky-50 border border-sky-200 p-4">
                <p className="text-sm text-sky-800">
                  These preferences only affect how Clinx reaches you. School-wide routing and escalation rules remain
                  managed by school leaders.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Highest Priority Pupils</h2>
                <p className="text-sm text-gray-500 mt-1">The pupils you teach with the strongest current pattern match.</p>
              </div>
              <Brain className="w-5 h-5 text-sky-600" />
            </div>
            <div className="space-y-3">
              {topPriorityPupils.map((pupil) => (
                <button
                  key={pupil.id}
                  onClick={() => navigate(`/teacher/pupils/${pupil.id}`)}
                  className="w-full text-left rounded-xl border border-gray-200 p-4 hover:border-sky-300 hover:bg-sky-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{getPupilPrimaryLabel(pupil, user)}</p>
                      <p className="text-xs text-gray-500 mt-1">Year {pupil.year} - Form {pupil.form}</p>
                    </div>
                    <RiskBadge level={pupil.riskLevel} score={pupil.riskScore} />
                  </div>
                  <p className="text-xs text-gray-600 mt-3 line-clamp-2">
                    {pupil.aiExplanation[0]?.text || 'Multiple emerging signals detected across existing school systems.'}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                    <span>Attendance {pupil.attendance}%</span>
                    <span>Behaviour {pupil.behaviourIncidents}</span>
                    <span>Homework {pupil.homeworkPct}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Action Queue</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Lightweight next steps for the pupils most likely to need your attention.
                </p>
              </div>
              <ClipboardList className="w-5 h-5 text-sky-600" />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Monitoring</p>
                <p className="text-2xl font-bold text-amber-900 mt-2">{monitoringCount}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Follow Up Planned</p>
                <p className="text-2xl font-bold text-emerald-900 mt-2">{followUpCount}</p>
              </div>
            </div>
            <div className="space-y-3">
              {priorityQueue.slice(0, 4).map(({ pupil, status }) => (
                <div key={pupil.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{getPupilPrimaryLabel(pupil, user)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {pupil.aiExplanation[0]?.text || 'Pattern shift detected across existing school systems.'}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        status === 'Follow Up Planned'
                          ? 'bg-emerald-100 text-emerald-700'
                          : status === 'Monitoring'
                            ? 'bg-amber-100 text-amber-700'
                            : status === 'Acknowledged'
                              ? 'bg-sky-100 text-sky-700'
                              : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {actionOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => setTeacherAction(pupil.id, option)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          status === option ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Low admin overhead
                    </span>
                    <button
                      onClick={() => navigate(`/teacher/pupils/${pupil.id}`)}
                      className="flex items-center gap-1 text-sky-700 hover:text-sky-800 font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View pupil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Classes to Watch</h2>
            <div className="space-y-3">
              {atRiskClasses.map((schoolClass) => (
                <button
                  key={schoolClass.id}
                  onClick={() => navigate(`/teacher/class/${schoolClass.id}`)}
                  className="w-full text-left rounded-xl bg-slate-50 border border-slate-200 p-4 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{schoolClass.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{schoolClass.subject}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                      High {schoolClass.high}
                    </span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      Medium {schoolClass.medium}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
