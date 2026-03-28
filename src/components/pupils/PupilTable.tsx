import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { getAllPupils } from '../../services/dataService';
import RiskBadge from '../common/RiskBadge';
import type { Pupil, RouteBasePath } from '../../types/domain';

type SortDirection = 'asc' | 'desc';
type PupilTableSortKey = 'id' | 'year' | 'form' | 'riskLevel' | 'riskScore' | 'attendance' | 'lastUpdated';

type PupilTableProps = {
  basePath?: RouteBasePath;
  pupils?: Pupil[];
};

export default function PupilTable({ basePath = '/dashboard', pupils: pupilsProp }: PupilTableProps) {
  const allPupils = pupilsProp || getAllPupils();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState<Pupil['riskLevel'] | 'all'>('all');
  const [sortKey, setSortKey] = useState<PupilTableSortKey>('riskScore');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);
  const perPage = 50;

  const filtered = useMemo(() => {
    let result = [...allPupils];
    if (search) result = result.filter(p => p.id.toLowerCase().includes(search.toLowerCase()));
    if (yearFilter !== 'all') result = result.filter(p => p.year === parseInt(yearFilter));
    if (riskFilter !== 'all') result = result.filter(p => p.riskLevel === riskFilter);
    result.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return result;
  }, [allPupils, search, yearFilter, riskFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  function toggleSort(key: PupilTableSortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  function SortIcon({ col }: { col: PupilTableSortKey }) {
    if (sortKey !== col) return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-300" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-sky-600" /> : <ChevronDown className="w-3.5 h-3.5 text-sky-600" />;
  }

  const columns: Array<{ key: PupilTableSortKey; label: string }> = [
    { key: 'id', label: 'Pupil ID' },
    { key: 'year', label: 'Year' },
    { key: 'form', label: 'Form' },
    { key: 'riskLevel', label: 'Risk Level' },
    { key: 'riskScore', label: 'Risk Score' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'lastUpdated', label: 'Last Updated' },
  ];

  return (
    <div className="space-y-4 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Pupils</h1>
        <p className="text-sm text-gray-500 mt-1">{filtered.length} pupils found</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          />
        </div>
        <select
          value={yearFilter}
          onChange={e => { setYearFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
        >
          <option value="all">All Years</option>
          {[5,6,7,8].map(y => <option key={y} value={y}>Year {y}</option>)}
        </select>
        <select
          value={riskFilter}
          onChange={e => { setRiskFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
        >
          <option value="all">All Risk Levels</option>
          <option value="High">High Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="Low">Low Risk</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                >
                  <span className="flex items-center gap-1">
                    {col.label} <SortIcon col={col.key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.map(pupil => (
              <tr
                key={pupil.id}
                onClick={() => navigate(`${basePath}/pupils/${pupil.id}`)}
                className="hover:bg-sky-50/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{pupil.id}</td>
                <td className="px-4 py-3 text-sm text-gray-600">Year {pupil.year}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{pupil.form}</td>
                <td className="px-4 py-3"><RiskBadge level={pupil.riskLevel} /></td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{pupil.riskScore}%</td>
                <td className="px-4 py-3 text-sm text-gray-600">{pupil.attendance}%</td>
                <td className="px-4 py-3 text-xs text-gray-400">28 Mar 2026</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
              Math.max(0, page - 3), Math.min(totalPages, page + 2)
            ).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 text-sm rounded-lg ${p === page ? 'bg-sky-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
