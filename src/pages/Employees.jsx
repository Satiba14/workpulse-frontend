import { useState, useCallback, useRef } from "react";
import Layout from "../components/Layout";
import { StatusBadge } from "../common/Badge";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";
import ConfirmDialog from "../common/ConfirmDialog";
import { useEmployees } from "../hooks/useEmployees";
import { useDepartments } from "../hooks/useDepartments";
import { getInitials, formatDate } from "../utils/formatters";
import { deleteEmployee, getEmployeeById } from "../api/employees";
import { Users, Plus, Search, Eye, Trash2 } from "lucide-react";
import AddEmployeeModal from "../components/AddEmployeeModal";
import EmployeeProfilePanel from "../components/EmployeeProfilePanel";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "billable", label: "Billable" },
  { value: "non_billable", label: "Non-Billable" },
  { value: "buffer", label: "Buffer" },
  { value: "inactive", label: "Inactive" },
];

let searchTimer = null;

const Employees = () => {
  const [filters, setFilters] = useState({});
  const [searchText, setSearchText] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { employees, loading, refetch } = useEmployees(filters);
  const { departments } = useDepartments();

  const handleSearchChange = useCallback((val) => {
    setSearchText(val);
    clearTimeout(searchTimer);
    searchTimer = setTimeout(
      () => setFilters((f) => ({ ...f, search: val })),
      300,
    );
  }, []);

  const updateFilter = (key, value) => {
  console.log("Filter Changed:", key, value);

  setFilters(prev => ({
    ...prev,
    [key]: value
  }));
};


  const fetchAndShow = useCallback(async (id) => {
    if (!id) return;
    setLoadingProfile(true);
    try {
      const res = await getEmployeeById(id);
      const emp = res?.data?.data ?? res?.data ?? res;
      setSelectedEmployee(emp);
      setShowProfile(true);
    } catch (err) {
      console.error("Failed to load employee:", err);
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  const handleEditSuccess = useCallback(async () => {
    refetch();
    if (selectedEmployee?.id) {
      await fetchAndShow(selectedEmployee.id);
    }
  }, [selectedEmployee, refetch, fetchAndShow]);

  // ── Delete ────────────────────────────────────────────────────────────────
  const requestDelete = (e, id, name) => {
    e.stopPropagation();
    setConfirmTarget({ id, name });
  };

  const handleConfirmedDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      await deleteEmployee(confirmTarget.id);
      refetch();
      if (selectedEmployee?.id === confirmTarget.id) {
        setShowProfile(false);
        setSelectedEmployee(null);
      }
      setConfirmTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout bgClass="bg-sky-50/20 dark:bg-slate-950">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-sky-50 dark:bg-slate-800 rounded-xl p-2.5">
              <Users size={20} className="text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                Employees
              </h1>
              <p className="text-xs text-gray-400">
                {employees?.length || 0} total records
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:from-sky-400 transition-all"
          >
            <Plus size={16} /> Add Employee
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-gray-100 rounded-xl focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/50 font-medium"
            />
          </div>
          <select
            onChange={(e) => updateFilter("department", e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-gray-100 rounded-xl focus:outline-none focus:border-sky-400 font-medium text-gray-600 min-w-40"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => updateFilter("status", e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-gray-100 rounded-xl focus:outline-none focus:border-sky-400 font-medium text-gray-600"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          {loading ? (
            <LoadingSpinner color="sky" />
          ) : !employees || employees.length === 0 ? (
            <EmptyState icon={Users} message="No employees found" />
          ) : (
            <div className="max-h-[60vh] overflow-y-auto relative w-full">
              <table className="w-full min-w-[560px]">
                <thead className="sticky top-0 z-10 bg-gray-50/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-sm">
                  <tr className="border-b border-gray-100 dark:border-slate-800">
                    {[
                      "Name",
                      "Phone",
                      "Department",
                      "Reports To",
                      "Joined On",
                      "Status",
                      "",
                    ].map((h, i) => (
                      <th
                        key={i}
                        className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                  {employees.map((emp) => (
                    <tr
                      key={emp.id}
                      onClick={() => fetchAndShow(emp.id)}
                      className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                              {getInitials(emp.first_name, emp.last_name)}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                            {emp.first_name} {emp.last_name}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {emp.phone_no}
                      </td>
                      <td className="px-5 py-4">
                        {emp.department_name ? (
                          <span className="text-sm font-medium text-gray-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2.5 py-1 rounded-lg">
                            {emp.department_name}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 text-sm">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {emp.reporting_to_name ? (
                          emp.reporting_to_name
                        ) : (
                          <span className="text-gray-400 italic">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {formatDate(emp.joined_on)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={emp.status || "inactive"} />
                      </td>
                      <td
                        className="px-5 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1.5">
                          <button
                            disabled={loadingProfile}
                            onClick={() => fetchAndShow(emp.id)}
                            title="View profile"
                            className="w-8 h-8 flex items-center justify-center bg-sky-50 dark:bg-slate-800 rounded-lg hover:bg-sky-100 dark:hover:bg-slate-700 text-sky-600 dark:text-sky-400 disabled:opacity-50 transition-colors"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={(e) =>
                              requestDelete(
                                e,
                                emp.id,
                                `${emp.first_name} ${emp.last_name}`,
                              )
                            }
                            title="Remove"
                            className="w-8 h-8 flex items-center justify-center bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AddEmployeeModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={refetch}
        departments={departments}
        employees={employees} 
      />

      {showProfile && selectedEmployee && (
        <EmployeeProfilePanel
          employee={selectedEmployee}
          employees={employees}
          departments={departments}
          onClose={() => {
            setShowProfile(false);
            setSelectedEmployee(null);
          }}
          onEditSuccess={handleEditSuccess}
        />
      )}

      <ConfirmDialog
        isOpen={!!confirmTarget}
        title={`Remove ${confirmTarget?.name}?`}
        message="This will deactivate their account. They will no longer appear in active lists."
        confirmLabel="Yes, Remove"
        confirmClass="bg-red-500 hover:bg-red-600 text-white"
        onConfirm={handleConfirmedDelete}
        onCancel={() => setConfirmTarget(null)}
        loading={deleting}
      />
    </Layout>
  );
};

export default Employees;
