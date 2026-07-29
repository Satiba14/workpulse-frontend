import { useState } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";
import ConfirmDialog from "../common/ConfirmDialog";
import { useDepartments } from "../hooks/useDepartments";
import { createDepartment, updateDepartment, deleteDepartment } from "../api/departments";
import { getEmployees } from "../api/employees";
import BufferBillingChart from "../components/BufferBillingChart";
import DeptModal from "../components/DeptModal";
import DepartmentTable from "../components/DepartmentTable";
import { Building2, Plus, Search, Users, BarChart3 } from "lucide-react";

const EMPTY_FORM = {
  name: "",
  parent_department: "",
  manager_emp: "",
};

const TABS = ["Headcount", "Buffer & Billing"];

const Departments = () => {
  const { departments, loading, refetch } = useDepartments();
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );
  
  const totalEmployees = departments.reduce(
    (s, d) => s + (d.employee_count ?? 0),
    0,
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      await createDepartment({
        name: addForm.name,
        parent_department: addForm.parent_department || null,
        manager_emp: addForm.manager_emp || null,
      });
      setShowAdd(false);
      setAddForm(EMPTY_FORM);
      refetch();
    } catch (err) {
      setFormError("Failed to create department.");
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (dept) => {
    setEditTarget(dept);
    setEditForm({
      name: dept.name,
      parent_department: dept.parent_department ?? "",
      manager_emp: dept.manager_id ?? "",
    });
    setFormError("");
    loadEmployees();
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      await updateDepartment(editTarget.id, {
        name: editForm.name,
        parent_department: editForm.parent_department || null,
        manager_emp: editForm.manager_emp || null,
      });
      setEditTarget(null);
      refetch();
    } catch (err) {
      setFormError("Failed to update department.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmedDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      await deleteDepartment(confirmTarget.id);
      refetch();
      setConfirmTarget(null);
    } catch {
      alert("Failed to delete department.");
    } finally {
      setDeleting(false);
    }
  };

  const loadEmployees = async () => {
    if (employees.length > 0) return; 
    setLoadingEmployees(true);
    try {
      const res = await getEmployees();
      setEmployees(res.data ?? []);
    } catch (err) {
      console.error("Failed to load employees", err);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const chartData = filtered.map((dept) => ({
    name: dept.name,
    billable: dept.billable_count ?? 0,
    nonBillable: dept.non_billable_count ?? 0,
    bufferPercent: parseFloat(dept.buffer_pct ?? "0.0") || 0,
  }));

  return (
    <Layout bgClass="bg-sky-50/20 dark:bg-slate-950">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-sky-50 dark:bg-slate-800 rounded-xl p-2.5">
              <Building2 size={20} className="text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Departments</h1>
              <p className="text-xs text-gray-400">
                {departments.length} departments · {totalEmployees} active employees
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowAdd(true);
              setFormError("");
              setAddForm(EMPTY_FORM);
              loadEmployees();
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:from-sky-400 transition-all"
          >
            <Plus size={16} /> Add Department
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-gray-100 rounded-xl focus:outline-none focus:border-sky-400 font-medium"
            />
          </div>
          <div className="flex bg-gray-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
            {TABS.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === i
                    ? "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {i === 0 ? <Users size={13} /> : <BarChart3 size={13} />}
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* UI FIX: Removed min-h-[550px] here so the main dashboard container card doesn't push the window down */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20">
              <LoadingSpinner color="sky" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20">
              <EmptyState icon={Building2} message="No departments found" />
            </div>
          ) : activeTab === 1 ? (
            <div className="p-6 pb-16 overflow-visible min-h-[420px]">
              <BufferBillingChart data={chartData} />
            </div>
          ) : (
            /* UI FIX: Set max-height to 380px so it strictly starts scrolling internally past 5 records */
            <div className="max-h-[380px] overflow-y-auto">
              <DepartmentTable 
                departments={filtered} 
                onEdit={openEdit} 
                onDelete={setConfirmTarget} 
              />
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <DeptModal
          title="Add Department"
          form={addForm}
          setForm={setAddForm}
          departments={departments}
          employees={employees}
          onClose={() => setShowAdd(false)}
          onSubmit={handleAdd}
          submitting={submitting}
          error={formError}
        />
      )}
      
      {editTarget && (
        <DeptModal
          title={`Edit — ${editTarget.name}`}
          form={editForm}
          setForm={setEditForm}
          departments={departments.filter((d) => d.id !== editTarget.id)}
          employees={employees}
          onClose={() => setEditTarget(null)}
          onSubmit={handleEdit}
          submitting={submitting}
          error={formError}
        />
      )}

      <ConfirmDialog
        isOpen={!!confirmTarget}
        title={`Delete "${confirmTarget?.name}"?`}
        message={`This will deactivate the department and unassign ${confirmTarget?.employee_count ?? 0} employee(s). This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        confirmClass="bg-red-500 hover:bg-red-600 text-white"
        onConfirm={handleConfirmedDelete}
        onCancel={() => setConfirmTarget(null)}
        loading={deleting}
      />
    </Layout>
  );
};

export default Departments;