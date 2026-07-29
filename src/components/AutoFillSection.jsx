import { User, FileText, Briefcase, Users, Calendar, Mail, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export default function AutoFillSection({ autoData }) {
  if (!autoData) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-5 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 flex items-center gap-2">
        <CheckCircle2 size={14} className="text-blue-600" />
        <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
          Auto-fetched from records
        </span>
      </div>

      <div className="p-5 flex gap-5">
        <div className="flex-shrink-0">
          {autoData.photo_base64 ? (
            <img
              src={`data:${autoData.photo_type};base64,${autoData.photo_base64}`}
              alt={autoData.first_name}
              className="w-20 h-24 object-cover rounded-xl border border-gray-200 dark:border-slate-700"
            />
          ) : (
            <div className="w-20 h-24 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center bg-gray-50 dark:bg-slate-800">
              <ImageIcon size={20} className="text-gray-300" />
            </div>
          )}
        </div>

        <div className="flex-1 grid grid-cols-2 gap-3">
          {[
            { icon: User,      label: 'Name',         value: `${autoData.first_name} ${autoData.last_name}` },
            { icon: FileText,  label: 'Emp ID',        value: autoData.emp_id },
            { icon: Briefcase, label: 'Team',          value: autoData.department || '—' },
            { icon: Users,     label: 'Reporting To',  value: autoData.reporting_to || '—' },
            { icon: Calendar,  label: 'Joining Date',  value: autoData.joined_on || '—' },
            { icon: Briefcase, label: 'Designation',   value: autoData.designation || '—' },
            { icon: Mail,      label: 'Email',         value: autoData.email || '—' },
            { icon: Mail,      label: 'Official Email',value: autoData.official_email || '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label}>
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon size={11} className="text-gray-400" />
                <span className="text-xs text-gray-400 font-medium">{label}</span>
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} //[cite: 6]