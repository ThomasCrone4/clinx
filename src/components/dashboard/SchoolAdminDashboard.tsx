import RiskSummaryCards from './RiskSummaryCards';
import QuickStats from './QuickStats';
import AttendanceChart from './AttendanceChart';
import HomeworkCompletionChart from './HomeworkCompletionChart';
import CohortInsightsPanel from './CohortInsightsPanel';

export default function SchoolAdminDashboard() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Predicted concerns and early intervention priorities across your school.
        </p>
      </div>
      <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
        <p className="text-sm text-sky-800">
          These insights are drawn from the systems your school already uses, so staff can act earlier without extra
          data entry or a separate monitoring process.
        </p>
      </div>
      <QuickStats />
      <RiskSummaryCards />
      <CohortInsightsPanel />
      <div className="grid gap-6 xl:grid-cols-2">
        <AttendanceChart />
        <HomeworkCompletionChart />
      </div>
    </div>
  );
}
