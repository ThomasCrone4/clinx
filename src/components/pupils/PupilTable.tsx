import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { getAllClasses, getAllPupils } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import RiskBadge from '../common/RiskBadge';
import type { Pupil, RouteBasePath } from '../../types/domain';
import { canViewPupilNames, getPupilPrimaryLabel, getPupilSecondaryLabel, matchesPupilSearch } from '../../utils/pupilDisplay';

type SortDirection = 'asc' | 'desc';
type PupilTableSortKey = 'id' | 'year' | 'form' | 'riskLevel' | 'riskScore' | 'attendance' | 'lastUpdated';

type PupilTableProps = {
  basePath?: RouteBasePath;
  pupils?: Pupil[];
  title?: string;
  description?: string | null;
  hideYearFilter?: boolean;
  headerContent?: ReactNode;
};

export default function PupilTable({
  basePath = '/dashboard',
  pupils: pupilsProp,
  title = 'All Pupils',
  description,
  hideYearFilter = false,
  headerContent,
}: PupilTableProps) {
  const allPupils = pupilsProp || getAllPupils();
  const allClasses = getAllClasses();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const riskParam = searchParams.get('risk');
  const initialRiskFilter: Pupil['riskLevel'] | 'all' =
    riskParam === 'High' || riskParam === 'Medium' || riskParam === 'Low' ? riskParam : 'all';
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [formFilter, setFormFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState<Pupil['riskLevel'] | 'all'>(initialRiskFilter);
  const [sortKey, setSortKey] = useState<PupilTableSortKey>('riskScore');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);
  const perPage = 50;

  useEffect(() => {
    setRiskFilter(initialRiskFilter);
    setPage(1);
  }, [initialRiskFilter]);

  const selectedYear = yearFilter === 'all' ? null : Number.parseInt(yearFilter, 10);
  const yearClasses = useMemo(
    () => (selectedYear ? allClasses.filter((schoolClass) => schoolClass.yearGroup === selectedYear) : []),
    [allClasses, selectedYear],
  );
  const subjectOptions = useMemo(
    () => Array.from(new Set(yearClasses.map((schoolClass) => schoolClass.subject))).sort(),
    [yearClasses],
  );
  const subjectClasses = useMemo(
    () =>
      subjectFilter === 'all'
        ? yearClasses
        : yearClasses.filter((schoolClass) => schoolClass.subject === subjectFilter),
    [subjectFilter, yearClasses],
  );
  const formOptions = useMemo(
    () => Array.from(new Set(subjectClasses.map((schoolClass) => schoolClass.form))).sort(),
    [subjectClasses],
  );
  const formClasses = useMemo(
    () =>
      formFilter === 'all'
        ? subjectClasses
        : subjectClasses.filter((schoolClass) => schoolClass.form === formFilter),
    [formFilter, subjectClasses],
  );

  const filtered = useMemo(() => {
    let result = [...allPupils];

    if (search) {
      result = result.filter((pupil) => matchesPupilSearch(pupil, search, user));
    }

    if (!hideYearFilter && selectedYear) {
      result = result.filter((pupil) => pupil.year === selectedYear);
    }

    if (subjectFilter !== 'all') {
      const matchingClassIds = new Set(subjectClasses.map((schoolClass) => schoolClass.id));
      result = result.filter((pupil) => pupil.classIds.some((classId) => matchingClassIds.has(classId)));
    }

    if (formFilter !== 'all') {
      const matchingClassIds = new Set(formClasses.map((schoolClass) => schoolClass.id));
      result = result.filter((pupil) => pupil.classIds.some((classId) => matchingClassIds.has(classId)));
    }

    if (riskFilter !== 'all') {
      result = result.filter((pupil) => pupil.riskLevel === riskFilter);
    }

    result.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });

    return result;
  }, [
    allPupils,
    formClasses,
    formFilter,
    hideYearFilter,
    riskFilter,
    search,
    selectedYear,
    sortDir,
    sortKey,
    subjectClasses,
    subjectFilter,
    user,
  ]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [filtered.length, page]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  function toggleSort(key: PupilTableSortKey) {
    if (sortKey === key) {
      setSortDir((direction) => (direction === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function SortIcon({ col }: { col: PupilTableSortKey }) {
    if (sortKey !== col) {
      return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-300" />;
    }

    return sortDir === 'asc' ? (
      <ChevronUp className="w-3.5 h-3.5 text-sky-600" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-sky-600" />
    );
  }

  const columns: Array<{ key: PupilTableSortKey; label: string }> = [
    { key: 'id', label: canViewPupilNames(user?.role) ? 'Pupil' : 'Pupil ID' },
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
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description !== null && (
          <p className="text-sm text-gray-500 mt-1">{description ?? `${filtered.length} pupils found`}</p>
        )}
      </div>

      {headerContent}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder={canViewPupilNames(user?.role) ? 'Search by pupil name or ID...' : 'Search by ID...'}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          />
        </div>

        {!hideYearFilter && (
          <select
            value={yearFilter}
            onChange={(event) => {
              setYearFilter(event.target.value);
              setSubjectFilter('all');
              setFormFilter('all');
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          >
            <option value="all">All Years</option>
            {[5, 6, 7, 8].map((year) => (
              <option key={year} value={year}>
                Year {year}
              </option>
            ))}
          </select>
        )}

        <select
          value={riskFilter}
          onChange={(event) => {
            setRiskFilter(event.target.value as Pupil['riskLevel'] | 'all');
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
        >
          <option value="all">All Risk Levels</option>
          <option value="High">High Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="Low">Low Risk</option>
        </select>
      </div>

      {!hideYearFilter && selectedYear && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-40">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                Refine by Subject
              </label>
              <select
                value={subjectFilter}
                onChange={(event) => {
                  setSubjectFilter(event.target.value);
                  setFormFilter('all');
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
              >
                <option value="all">All Subjects</option>
                {subjectOptions.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {subjectFilter !== 'all' && (
              <div className="min-w-40">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  Then by Form
                </label>
                <select
                  value={formFilter}
                  onChange={(event) => {
                    setFormFilter(event.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  <option value="all">All Forms</option>
                  {formOptions.map((form) => (
                    <option key={form} value={form}>
                      {form}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
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
            {paginated.map((pupil) => (
              <tr
                key={pupil.id}
                onClick={() => navigate(`${basePath}/pupils/${pupil.id}`)}
                className="hover:bg-sky-50/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{getPupilPrimaryLabel(pupil, user)}</div>
                  {canViewPupilNames(user?.role) && (
                    <div className="text-xs text-gray-400 mt-0.5">{getPupilSecondaryLabel(pupil, user)}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">Year {pupil.year}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{pupil.form}</td>
                <td className="px-4 py-3">
                  <RiskBadge level={pupil.riskLevel} />
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{pupil.riskScore}%</td>
                <td className="px-4 py-3 text-sm text-gray-600">{pupil.attendance}%</td>
                <td className="px-4 py-3 text-xs text-gray-400">28 Mar 2026</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
              .map((value) => (
                <button
                  key={value}
                  onClick={() => setPage(value)}
                  className={`w-8 h-8 text-sm rounded-lg ${
                    value === page ? 'bg-sky-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {value}
                </button>
              ))}
            <button
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
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
