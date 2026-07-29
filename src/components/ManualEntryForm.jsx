import { FileText, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { REVISION_OPTIONS } from '../utils/employeeDocumentUtils';

export default function ManualEntryForm({
  manual, updManual, isFresher, setIsFresher,
  customFields, addCustomField, updateCustomField, removeCustomField
}) {
  return (
    <>
      {/* Fresher / Experienced toggle */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Employee Type</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {isFresher ? 'Fresher — includes apprentice pay period' : 'Experienced — single pay rate, no apprentice period'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold ${isFresher ? 'text-blue-600' : 'text-gray-400'}`}>Fresher</span>
          <button
            type="button"
            onClick={() => setIsFresher(f => !f)}
            className={`relative w-12 h-6 rounded-full transition-colors ${isFresher ? 'bg-blue-600' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isFresher ? 'translate-x-0' : 'translate-x-6'}`} />
          </button>
          <span className={`text-xs font-bold ${!isFresher ? 'text-blue-600' : 'text-gray-400'}`}>Experienced</span>
        </div>
      </div>

      {/* Manual entry section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800 flex items-center gap-2">
          <FileText size={14} className="text-amber-600" />
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
            Fill compensation details
          </span>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">
                Pay Label
              </label>
              <input type="text" value={manual.pay_label_1} onChange={e => updManual('pay_label_1', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">
                Amount
              </label>
              <input type="text" value={manual.pay_value_1} onChange={e => updManual('pay_value_1', e.target.value)} placeholder="₹ 25,000" className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition" />
            </div>
          </div>

          {isFresher && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">Apprentice Pay Label</label>
                <input type="text" value={manual.pay_label_2} onChange={e => updManual('pay_label_2', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">Amount</label>
                <input type="text" value={manual.pay_value_2} onChange={e => updManual('pay_value_2', e.target.value)} placeholder="₹ 30,000" className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">Revision Period</label>
              <div className="relative">
                <select value={manual.revision_period_label} onChange={e => updManual('revision_period_label', e.target.value)} className="w-full pl-3 pr-9 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition cursor-pointer">
                  <option value="">Select period…</option>
                  {REVISION_OPTIONS.map(o => <option key={o.label} value={o.label}>{o.label}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {manual.revision_period_label === 'Custom (enter manually)' ? (
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">Custom Period</label>
                <input type="text" value={manual.revision_period_custom} onChange={e => updManual('revision_period_custom', e.target.value)} placeholder="e.g. 9 Months" className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition" />
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">Next Revision Date</label>
                <input type="text" value={manual.next_revision_date} disabled placeholder="Auto-calculated" className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800/60 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
              </div>
            )}
          </div>

          {manual.revision_period_label === 'Custom (enter manually)' && (
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">Next Revision Date</label>
              <input type="text" value={manual.next_revision_date} onChange={e => updManual('next_revision_date', e.target.value)} placeholder="DD/MM/YYYY" className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition" />
            </div>
          )}

          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Additional Fields</label>
              <button type="button" onClick={addCustomField} className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2.5 py-1.5 rounded-lg transition-colors">
                <Plus size={13} /> Add Field
              </button>
            </div>

            {customFields.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No additional fields yet. Use "Add Field" for anything not covered above — e.g. Probation Period, Notice Period, Laptop Provided.</p>
            ) : (
              <div className="space-y-2.5">
                {customFields.map((field) => (
                  <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-start">
                    <input type="text" value={field.label} onChange={e => updateCustomField(field.id, 'label', e.target.value)} placeholder="Field name" className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition" />
                    <input type="text" value={field.value} onChange={e => updateCustomField(field.id, 'value', e.target.value)} placeholder="Value" className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition" />
                    <button type="button" onClick={() => removeCustomField(field.id)} className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Remove field"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">Bond</label>
            <input type="text" value={manual.bond} onChange={e => updManual('bond', e.target.value)} placeholder="e.g. 12 Months / None" className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition" />
          </div>
        </div>
      </div>
    </>
  );
} 