import { FileText } from 'lucide-react';

export default function LetterHistory({ letterHistory }) {
  if (!letterHistory || letterHistory.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-5 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 flex items-center gap-2">
        <FileText size={14} className="text-gray-500" />
        <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
          Previously Generated ({letterHistory.length})
        </span>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-slate-800">
        {letterHistory.map((rec) => (
          <a
            key={rec.id}
            href={rec.file_path}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <FileText size={13} className="text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {new Date(rec.created_at).toLocaleString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </span>
              {rec.generated_by && (
                <span className="text-xs text-gray-400">by {rec.generated_by}</span>
              )}
            </div>
            <span className="text-xs font-bold text-blue-600">Open →</span>
          </a>
        ))}
      </div>
    </div>
  );
}