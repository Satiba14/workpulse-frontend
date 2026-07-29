import { CheckCircle2 } from 'lucide-react';

export const YesNo = ({ value, onChange }) => (
  <div className="flex gap-3 mt-1">
    {[{ label: 'Yes', val: true }, { label: 'No', val: false }].map(({ label, val }) => (
      <button key={label} type="button" onClick={() => onChange(val)}
        className={`px-6 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
          value === val
            ? val ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-red-500 border-red-500 text-white'
            : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
        }`}>
        {label}
      </button>
    ))}
  </div>
);

export const RatingRow = ({ label, value, onChange, choices }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-sm text-gray-700 flex-1 pr-4">{label}</span>
    <div className="flex gap-2">
      {choices.map(({ val, label: lbl }) => (
        <button key={val} type="button" onClick={() => onChange(val)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
            value === val
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'
          }`}>
          {lbl}
        </button>
      ))}
    </div>
  </div>
);

export const Checkbox = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 py-1.5 cursor-pointer group">
    <div onClick={onChange}
      className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all flex-shrink-0 ${
        checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
      }`}>
      {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>}
    </div>
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

export const TextArea = ({ value, onChange, placeholder, rows = 2 }) => (
  <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none mt-1" />
);

export const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-sm font-bold text-gray-800">{title}</h2>
    {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
  </div>
);

export const StepDot = ({ active, done, num, label }) => (
  <div className="flex flex-col items-center gap-1">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
      done   ? 'bg-emerald-500 text-white' :
      active ? 'bg-blue-600 text-white'    :
               'bg-gray-100 text-gray-400'
    }`}>
      {done ? <CheckCircle2 size={16} /> : num}
    </div>
    <span className={`text-xs font-semibold hidden sm:block ${
      active ? 'text-blue-600' : done ? 'text-emerald-500' : 'text-gray-400'
    }`}>{label}</span>
  </div>
);