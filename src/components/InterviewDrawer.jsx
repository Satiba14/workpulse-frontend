import { useState, useEffect } from 'react';
import {
  ClipboardList, X, User, Flag, Calendar,
  RefreshCw, Send, ChevronDown, ChevronUp,
} from 'lucide-react';
import { API_BASE, getToken, fmt } from '../utils/exitInterviewUtils';
import { InterviewStatusBadge, BoolAnswer } from '../common/Badge';

// ── Helpers ───────────────────────────────────────────────────────────────────
const RATING_LABEL = { excellent: 'Excellent', good: 'Good', fair: 'Fair', poor: 'Poor' };
const SCALE_LABEL  = { very_good: 'Very Good', good: 'Good', average: 'Average', poor: 'Poor' };

const RatingBadge = ({ value }) => {
  if (!value) return <span className="text-xs text-gray-400 italic">—</span>;
  const colors = {
    excellent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    good:      'bg-blue-50 text-blue-700 border-blue-200',
    fair:      'bg-amber-50 text-amber-700 border-amber-200',
    poor:      'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-bold border ${colors[value] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {RATING_LABEL[value] ?? value}
    </span>
  );
};

const ScaleBadge = ({ value }) => {
  if (!value) return <span className="text-xs text-gray-400 italic">—</span>;
  const colors = {
    very_good: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    good:      'bg-blue-50 text-blue-700 border-blue-200',
    average:   'bg-amber-50 text-amber-700 border-amber-200',
    poor:      'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-bold border ${colors[value] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {SCALE_LABEL[value] ?? value}
    </span>
  );
};

const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/60 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
      >
        <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">{title}</span>
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {open && <div className="px-4 py-3 space-y-2">{children}</div>}
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-1.5 border-b border-gray-50 dark:border-slate-800 last:border-0">
    <span className="text-xs text-gray-500 dark:text-gray-400 flex-1">{label}</span>
    <div className="text-right flex-shrink-0">{value}</div>
  </div>
);

const TextVal = ({ value }) =>
  value
    ? <span className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">{value}</span>
    : <span className="text-xs text-gray-400 italic">—</span>;

// ── Main Drawer ───────────────────────────────────────────────────────────────
const InterviewDrawer = ({ interview, onClose, onResend, resending }) => {
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (!interview) { setCurrent(null); return; }
    setCurrent(interview);
    fetch(`${API_BASE}/exit-interviews/`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(data => {
        const fresh = data.find(i => i.id === interview.id);
        if (fresh) setCurrent(fresh);
      })
      .catch(console.error);
  }, [interview]);

  if (!interview || !current) return null;
  const r = current?.response;

  const LEAVING_REASONS = [
    ['left_better_compensation',      'Better Compensation'],
    ['left_better_designation',       'Better Designation'],
    ['left_better_benefits',          'Better Benefits'],
    ['left_better_job_opportunity',   'Better Job Opportunity'],
    ['left_better_working_conditions','Better Working Conditions'],
    ['left_lack_of_recognition',      'Lack of Recognition for Work'],
    ['left_commuting_distance',       'Commuting Distance'],
    ['left_difficult_supervisor',     'Difficult with Supervisor'],
    ['left_no_advancement',           'No Advancement in Profile'],
    ['left_family_circumstances',     'Family Circumstances'],
    ['left_moving_out_of_town',       'Moving out of Town'],
    ['left_illness',                  'Illness'],
    ['left_retirement',               'Retirement'],
    ['left_self_employment',          'Self-Employment'],
  ];

  const selectedReasons = LEAVING_REASONS.filter(([key]) => r?.[key]);

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-slate-900 border-l border-gray-100 dark:border-slate-800 shadow-2xl z-50 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-xl p-2"><ClipboardList size={15} className="text-white" /></div>
            <div>
              <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">Exit Interview</h2>
              <p className="text-xs text-gray-400">{current?.employee_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-colors">
            <X size={17} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* Meta cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: User,     label: 'Employee',  value: current?.employee_name },
              { icon: Flag,     label: 'Status',    value: <InterviewStatusBadge status={current?.status} /> },
              { icon: Calendar, label: 'Sent',      value: fmt(current?.sent_at) },
              { icon: Calendar, label: 'Submitted', value: fmt(current?.submitted_at) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-3 border border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-400 font-medium">{label}</span>
                </div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{value}</div>
              </div>
            ))}
          </div>

          {/* Interview link */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-100 dark:border-blue-800">
            <p className="text-xs font-semibold text-blue-600 mb-1">Interview Link</p>
            <p className="text-xs text-blue-500 font-mono break-all">
              {window.location.origin}/exit-interview/{current?.employee_id}/{current?.token}
            </p>
          </div>

          {/* ── Full Response ── */}
          {r ? (
            <div className="space-y-3">

              {/* Section 1 — Reason for Joining */}
              <Section title="1 · Reason for Joining Invenger">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    [r.joined_for_benefits,   'Benefits'],
                    [r.joined_for_career,     'Career Advancements'],
                    [r.joined_for_salary,     'Salary'],
                    [r.joined_for_reputation, 'Reputation as a good place to work'],
                  ].filter(([v]) => v).map(([, label]) => (
                    <span key={label} className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg">
                      ✓ {label}
                    </span>
                  ))}
                  {r.joined_for_other && (
                    <span className="text-xs text-gray-600 dark:text-gray-300">Others: {r.joined_for_other}</span>
                  )}
                  {!r.joined_for_benefits && !r.joined_for_career && !r.joined_for_salary && !r.joined_for_reputation && !r.joined_for_other && (
                    <span className="text-xs text-gray-400 italic">None selected</span>
                  )}
                </div>
              </Section>

              {/* Section 2 — Rating of Invenger */}
              <Section title="2 · Rating of Invenger">
                {[
                  { label: 'Company Benefits',              key: 'rating_company_benefits'   },
                  { label: 'Salary',                        key: 'rating_salary'             },
                  { label: 'Working Conditions',            key: 'rating_working_conditions' },
                  { label: 'Advancement/Training Opportunity', key: 'rating_advancement'     },
                  { label: 'Others',                        key: 'rating_others'             },
                  { label: 'Overall Rating',                key: 'rating_overall'            },
                ].map(({ label, key }) => (
                  <Row key={key} label={label} value={<RatingBadge value={r[key]} />} />
                ))}
              </Section>

              {/* Section 3 — Communication */}
              <Section title="3 · Communication Ratings">
                {[
                  { label: 'Throughout the company',    key: 'comm_throughout_company'  },
                  { label: 'Between managers and staff',key: 'comm_managers_staff'      },
                  { label: 'Between departments',       key: 'comm_between_departments' },
                  { label: 'Within your department',    key: 'comm_within_department'   },
                ].map(({ label, key }) => (
                  <Row key={key} label={label} value={<RatingBadge value={r[key]} />} />
                ))}
              </Section>

              {/* Section 4 — Yes/No Experience */}
              <Section title="4 · Experience at Invenger">
                {[
                  { label: 'Position represented properly at interview?', key: 'position_represented_properly'  },
                  { label: 'Salary competitive?',                         key: 'salary_competitive'             },
                  { label: 'Position met initial expectations?',          key: 'position_met_expectations'      },
                  { label: 'Satisfied with performance management?',      key: 'satisfied_performance_mgmt'     },
                  { label: 'Enjoyed work?',                               key: 'enjoyed_work'                   },
                  { label: 'Work hours reasonable?',                      key: 'work_hours_reasonable'          },
                  { label: 'Workload reasonable?',                        key: 'workload_reasonable'            },
                  { label: 'Sufficient resources provided?',              key: 'sufficient_resources'           },
                  { label: 'Familiar with disciplinary procedures?',      key: 'familiar_disciplinary_procedures'},
                  { label: 'Sufficient professional development?',        key: 'sufficient_professional_dev'    },
                  { label: 'Satisfied with training quality?',            key: 'satisfied_training_quality'     },
                  { label: 'Supervisors helpful?',                        key: 'supervisors_helpful'            },
                  { label: 'Would recommend Invenger?',                   key: 'would_recommend'                },
                  { label: 'Would rejoin Invenger?',                      key: 'would_rejoin'                   },
                ].map(({ label, key }) => (
                  <Row key={key} label={label} value={<BoolAnswer value={r[key]} />} />
                ))}
              </Section>

              {/* Section 5 — Open text */}
              <Section title="5 · Written Feedback">
                {[
                  { label: 'Enjoyed most about job',          key: 'enjoyed_most'          },
                  { label: 'Enjoyed least about Invenger',    key: 'enjoyed_least'         },
                  { label: 'Positive aspects of work',        key: 'positive_aspects'      },
                  { label: 'Job treated as important by others', key: 'job_importance_extent' },
                ].map(({ label, key }) => (
                  <div key={key} className="py-1.5 border-b border-gray-50 dark:border-slate-800 last:border-0">
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <TextVal value={r[key]} />
                  </div>
                ))}
              </Section>

              {/* Section 6 — Scale ratings */}
              <Section title="6 · Environment & Relationships">
                {[
                  { label: 'Work environment',           key: 'environment_rating'      },
                  { label: 'Morale in your area',        key: 'morale_rating'           },
                  { label: 'Co-worker relationships',    key: 'coworker_relationship'   },
                  { label: 'Supervisor relationships',   key: 'supervisor_relationship' },
                ].map(({ label, key }) => (
                  <Row key={key} label={label} value={<ScaleBadge value={r[key]} />} />
                ))}
              </Section>

              {/* Section 7 — Leaving reasons */}
              <Section title="7 · Primary Reason for Leaving">
                <div className="flex flex-wrap gap-1.5">
                  {selectedReasons.length > 0
                    ? selectedReasons.map(([key, label]) => (
                        <span key={key} className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg">
                          ✓ {label}
                        </span>
                      ))
                    : <span className="text-xs text-gray-400 italic">None selected</span>
                  }
                </div>
                {r.most_important_factor && (
                  <div className="mt-2 pt-2 border-t border-gray-50 dark:border-slate-800">
                    <p className="text-xs text-gray-400 mb-0.5">Most important factor</p>
                    <TextVal value={r.most_important_factor} />
                  </div>
                )}
              </Section>

              {/* Section 8 — Final questions */}
              <Section title="8 · Final Questions">
                <Row
                  label="Could anything prevent your leaving?"
                  value={<BoolAnswer value={r.could_prevent_leaving} />}
                />
                {r.could_prevent_leaving_details && (
                  <div className="pl-2 pb-1">
                    <TextVal value={r.could_prevent_leaving_details} />
                  </div>
                )}
                <Row
                  label="Suggestions for improvement?"
                  value={<BoolAnswer value={r.suggestions_for_improvement} />}
                />
                {r.suggestions_details && (
                  <div className="pl-2 pb-1">
                    <TextVal value={r.suggestions_details} />
                  </div>
                )}
                <Row
                  label="Anything else to share?"
                  value={<BoolAnswer value={r.anything_else} />}
                />
                {r.anything_else_details && (
                  <div className="pl-2 pb-1">
                    <TextVal value={r.anything_else_details} />
                  </div>
                )}
              </Section>

            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-8 border border-gray-100 dark:border-slate-800 text-center">
              <ClipboardList size={32} className="text-gray-200 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-sm text-gray-400 font-medium">No response yet</p>
              <p className="text-xs text-gray-400 mt-1">Employee hasn't submitted the form</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {current && current.status !== 'submitted' && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex-shrink-0">
            <button
              onClick={() => onResend(current)} disabled={resending}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm py-2.5 rounded-xl transition-colors"
            >
              {resending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
              {resending ? 'Sending...' : current?.status === 'sent' ? 'Resend Link' : 'Send Interview Link'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default InterviewDrawer;