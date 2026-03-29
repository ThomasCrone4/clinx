import { ArrowRight, BarChart3, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllClasses, getAllPupils } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { getPupilPrimaryLabel } from '../../utils/pupilDisplay';

export default function CohortInsightsPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const pupils = getAllPupils();
  const classes = getAllClasses();

  const yearInsights = [5, 6, 7, 8]
    .map((year) => {
      const yearPupils = pupils.filter((pupil) => pupil.year === year);
      const high = yearPupils.filter((pupil) => pupil.riskLevel === 'High').length;
      const medium = yearPupils.filter((pupil) => pupil.riskLevel === 'Medium').length;
      return {
        year,
        high,
        medium,
        total: yearPupils.length,
        score: high * 2 + medium,
      };
    })
    .sort((a, b) => b.score - a.score);

  const classInsights = classes
    .map((schoolClass) => {
      const classPupils = pupils.filter((pupil) => schoolClass.pupils.includes(pupil.id));
      const high = classPupils.filter((pupil) => pupil.riskLevel === 'High').length;
      const medium = classPupils.filter((pupil) => pupil.riskLevel === 'Medium').length;
      return {
        id: schoolClass.id,
        name: schoolClass.name,
        subject: schoolClass.subject,
        teacher: schoolClass.teacherName,
        teacherId: schoolClass.teacherId,
        high,
        medium,
        score: high * 2 + medium,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const atRiskPupils = [...pupils]
    .filter((pupil) => pupil.riskLevel !== 'Low')
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-[1.1fr_1.1fr_1fr] gap-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-sky-600" />
          <h3 className="text-sm font-semibold text-gray-700">Year Groups To Watch</h3>
        </div>
        <div className="space-y-3">
          {yearInsights.map((item) => (
            <div key={item.year} className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Year {item.year}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.total} pupils in cohort</p>
                </div>
                <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-medium">
                  {item.high + item.medium} flagged
                </span>
              </div>
              <div className="flex gap-2 mt-3 text-xs">
                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">High {item.high}</span>
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Medium {item.medium}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-violet-600" />
          <h3 className="text-sm font-semibold text-gray-700">Classes With Highest Concern</h3>
        </div>
        <div className="space-y-3">
          {classInsights.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/dashboard/staff/${item.teacherId}/class/${item.id}`)}
              className="w-full text-left rounded-lg border border-gray-200 p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.subject} - {item.teacher}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex gap-2 mt-3 text-xs">
                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">High {item.high}</span>
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Medium {item.medium}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-gray-700">Highest-Risk Pupils</h3>
        </div>
        <div className="space-y-3">
          {atRiskPupils.map((pupil) => (
            <button
              key={pupil.id}
              onClick={() => navigate(`/dashboard/pupils/${pupil.id}`)}
              className="w-full text-left rounded-lg border border-gray-200 p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{getPupilPrimaryLabel(pupil, user)}</p>
                  <p className="text-xs text-gray-500 mt-1">Year {pupil.year} - Form {pupil.form}</p>
                </div>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                  {pupil.riskScore}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-3 line-clamp-2">{pupil.aiExplanation[0]?.text}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
