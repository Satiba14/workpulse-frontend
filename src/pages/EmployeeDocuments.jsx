import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { FileText, Download, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { EMPTY_MANUAL, REVISION_OPTIONS, parseJoiningDate, addMonths, formatDate, blobToBase64 } from '../utils/employeeDocumentUtils';
import EmployeeSelector from '../components/EmployeeSelector';
import AutoFillSection from '../components/AutoFillSection';
import LetterHistory from '../components/LetterHistory';
import ManualEntryForm from '../components/ManualEntryForm';

const API_BASE = import.meta.env.VITE_API_BASE_URL; 
const EMAIL_SERVICE_BASE = import.meta.env.VITE_EMAIL_SERVICE_URL; //[cite: 6]
const getToken = () => localStorage.getItem('access_token'); //[cite: 6]

export default function EmployeeDocuments() {
  const [employees, setEmployees]   = useState([]);
  const [loadingEmps, setLoadingEmps] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [autoData, setAutoData]     = useState(null);
  const [isFresher, setIsFresher]   = useState(true);
  const [manual, setManual]         = useState(EMPTY_MANUAL);
  const [customFields, setCustomFields] = useState([]);
  const [letterHistory, setLetterHistory] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/employees/`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setEmployees(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => setError('Failed to load employees.'))
      .finally(() => setLoadingEmps(false));
  }, []); //[cite: 6]

  const handleSelectEmployee = useCallback(async (id) => {
    setSelectedId(id);
    setAutoData(null);
    setManual(EMPTY_MANUAL);
    setCustomFields([]);
    setIsFresher(true);
    setLetterHistory([]);
    setSuccess(false);
    setError('');
    if (!id) return;

    setLoadingData(true);
    try {
      const res = await fetch(`${API_BASE}/employees/${id}/letter-data/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Failed to load employee details.');
      const data = await res.json();
      setAutoData(data);

      fetch(`${API_BASE}/employees/${id}/generated-letters/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
        .then(r => r.ok ? r.json() : [])
        .then(setLetterHistory)
        .catch(() => setLetterHistory([]));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingData(false);
    }
  }, []); //[cite: 6]

  const updManual = (key, val) => setManual(m => ({ ...m, [key]: val })); //[cite: 6]

  const addCustomField = () => {
    setCustomFields(prev => [...prev, { id: `${Date.now()}-${prev.length}`, label: '', value: '' }]);
  }; //[cite: 6]

  const updateCustomField = (id, key, val) => {
    setCustomFields(prev => prev.map(f => f.id === id ? { ...f, [key]: val } : f));
  }; //[cite: 6]

  const removeCustomField = (id) => {
    setCustomFields(prev => prev.filter(f => f.id !== id));
  }; //[cite: 6]

  useEffect(() => {
    if (!autoData?.joined_on) return;
    const joinDate = parseJoiningDate(autoData.joined_on);
    if (!joinDate) return;

    const selected = REVISION_OPTIONS.find(o => o.label === manual.revision_period_label);
    if (selected && selected.months != null) {
      const calculated = addMonths(joinDate, selected.months);
      updManual('next_revision_date', formatDate(calculated));
    }
  }, [manual.revision_period_label, autoData?.joined_on]); //[cite: 6]

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    setSuccess(false);
    try {
      const revisionPeriodText = manual.revision_period_label === 'Custom (enter manually)'
        ? manual.revision_period_custom : manual.revision_period_label;

      const payload = {
        ...autoData,
        monthly_pay_0_6: manual.pay_value_1,
        monthly_pay_6_12: isFresher ? manual.pay_value_2 : '',
        pay_label_0_6: manual.pay_label_1,
        pay_label_6_12: isFresher ? manual.pay_label_2 : '',
        revision_period: revisionPeriodText,
        next_revision_date: manual.next_revision_date,
        bond: manual.bond,
        is_fresher: isFresher,
        custom_fields: customFields
          .filter(f => f.label.trim() !== '')
          .map(f => ({ label: f.label, value: f.value })),
      }; //[cite: 6]

      const res = await fetch(`${EMAIL_SERVICE_BASE}/generate-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to generate document.');

      const blob = await res.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `${autoData.first_name}_${autoData.last_name}_Details.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      try {
        const fileBase64 = await blobToBase64(blob);
        const saveRes = await fetch(`${API_BASE}/employees/${selectedId}/generated-letters/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ file_base64: fileBase64, snapshot_data: payload }),
        });
        if (saveRes.ok) {
          const record = await saveRes.json();
          setLetterHistory(prev => [record, ...prev]);
        }
      } catch {}

      setSuccess(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  }; //[cite: 6]

  return (
    <Layout bgClass="bg-sky-50/10 dark:bg-slate-950">
      <div className="space-y-5 max-w-4xl mx-auto pb-16">
        
        <div className="flex items-center gap-3">
          <div className="bg-sky-50 dark:bg-slate-800 rounded-xl p-2.5">
            <FileText size={20} className="text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Employee Documents</h1>
            <p className="text-xs text-gray-400">Generate employee detail letters for download</p>
          </div>
        </div>

        <EmployeeSelector 
          loadingEmps={loadingEmps} 
          employees={employees} 
          selectedId={selectedId} 
          onSelect={handleSelectEmployee} 
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <CheckCircle2 size={15} /> Document generated and downloaded successfully.
          </div>
        )}

        {loadingData && (
          <div className="flex items-center justify-center py-16 gap-2">
            <RefreshCw size={20} className="animate-spin text-blue-500" />
            <span className="text-sm text-gray-400">Loading employee details…</span>
          </div>
        )}

        {autoData && !loadingData && (
          <div className="space-y-4">
            <AutoFillSection autoData={autoData} />
            <LetterHistory letterHistory={letterHistory} />
            <ManualEntryForm 
              manual={manual} 
              updManual={updManual} 
              isFresher={isFresher} 
              setIsFresher={setIsFresher}
              customFields={customFields} 
              addCustomField={addCustomField} 
              updateCustomField={updateCustomField} 
              removeCustomField={removeCustomField} 
            />

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-colors"
            >
              {generating ? <RefreshCw size={15} className="animate-spin" /> : <Download size={15} />}
              {generating ? 'Generating…' : 'Generate & Download Document'}
            </button>
          </div>
        )}

        {!autoData && !loadingData && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
            <FileText size={36} className="text-gray-200 dark:text-slate-700" />
            <p className="text-sm text-gray-400 font-medium">Select an employee to generate their document</p>
          </div>
        )}
      </div>
    </Layout>
  );
} //[cite: 6]