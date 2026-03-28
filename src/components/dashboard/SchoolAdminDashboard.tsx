import RiskSummaryCards from './RiskSummaryCards';
import QuickStats from './QuickStats';
import AttendanceChart from './AttendanceChart';
import RecentAlerts from './RecentAlerts';

export default function SchoolAdminDashboard() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Predicted concerns and early intervention priorities across your school.
        </p>
      </div>
      <QuickStats />
      <RiskSummaryCards />
      <div className="grid grid-cols-2 gap-6">
        <AttendanceChart />
        <RecentAlerts />
      </div>
    </div>
  );
}
