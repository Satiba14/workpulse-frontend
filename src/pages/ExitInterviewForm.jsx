import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ClipboardList, CheckCircle2, AlertCircle, RefreshCw, Send, ChevronRight, ChevronLeft } from 'lucide-react';
import { API_BASE, INITIAL, RATING_OPTS, SCALE_OPTS, STEPS } from '../utils/exitFormConstants';
import { YesNo, RatingRow, Checkbox, TextArea, SectionTitle, StepDot } from '../components/FormUI';

export default function ExitInterviewForm() {
  const { emp_id, token } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep]           = useState(1);
  const [stepError, setStepError] = useState('');
  const [form, setForm]           = useState(INITIAL);

  useEffect(() => {
    fetch(`${API_BASE}/exit-interview/${emp_id}/${token}/`)
      .then(r => r.ok ? r.json() : Promise.reject('Invalid or expired link.'))
      .then(data => {
        setInterview(data);
        if (data.already_submitted || data.status === 'submitted') setSubmitted(true);
      })
      .catch(e => setError(typeof e === 'string' ? e : 'Invalid or expired link.'))
      .finally(() => setLoading(false));
  }, [emp_id, token]);

  const upd = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validateStep = () => {
    setStepError('');
    if (step === 3) {
      const yesNoFields = [
        'salary_competitive', 'position_met_expectations', 'satisfied_performance_mgmt',
        'enjoyed_work', 'work_hours_reasonable', 'workload_reasonable',
        'sufficient_resources', 'supervisors_helpful', 'would_recommend', 'would_rejoin',
      ];
      const unanswered = yesNoFields.filter(k => form[k] === null);
      if (unanswered.length > 0) {
        setStepError('Please answer all Yes/No questions before continuing.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => { if (validateStep()) setStep(s => s + 1); };
  const handleBack = () => { setStepError(''); setStep(s => s - 1); };

  const handleSubmit = async () => {
    setSubmitting(true); setStepError('');
    try {
      const res = await fetch(`${API_BASE}/exit-interview/${emp_id}/${token}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Submission failed.');
      }
      setSubmitted(true);
    } catch (e) {
      setStepError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Rendering States ──
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <RefreshCw size={28} className="animate-spin text-blue-500" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
        <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-gray-800 mb-2">Invalid Link</h2>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center">
        <CheckCircle2 size={56} className="text-emerald-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Your exit interview has been submitted successfully.<br />
          We appreciate your honest feedback and wish you all the best in your future endeavours.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <img src="/invenger-logo.png" alt="Invenger" className="h-6 object-contain" />
        </div>
        <p className="text-xs text-gray-400 mt-2">Confidential — INV/HR/EIQ/v1.0</p>
      </div>
    </div>
  );

  const info = interview?.employee_info ?? {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-xl p-2.5">
                <ClipboardList size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-800">Exit Interview Questionnaire</h1>
                <p className="text-xs text-gray-400">Invenger — Confidential · INV/HR/EIQ/v1.0</p>
              </div>
            </div>
            <img src="/invenger-logo.png" alt="Invenger" className="h-7 object-contain hidden sm:block" />
          </div>
          <p className="text-xs text-gray-500 mt-3 leading-relaxed italic border-t border-gray-50 pt-3">
            As a recently separated employee, you are a valuable source of information regarding work conditions during your employment.
            We hope that you will be candid with your answers so that we may gain from your experience with Invenger.
            <span className="font-semibold not-italic"> Thank you very much for your time and support.</span>
          </p>
        </div>

        {/* Employee info bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
  {[
    { label: 'Name', value: info.full_name },
{ label: 'Department', value: info.department },
{ label: 'Job Title', value: info.designation },

{ label: 'Date of Joining', value: info.joined_on },
{ label: 'Date of Separation', value: info.separation_date },
{ label: 'Date of Exit Interview', value: info.exit_interview_date },

{ label: 'Length of Service', value: info.length_of_service },
{ label: 'Supervisor', value: info.supervisor_name },
{ label: 'Head of Department', value: info.head_of_department },

{ label: 'Last Project Worked', value: info.last_project_worked }
  ].map(({ label, value }) => (
    <div key={label}>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-sm font-semibold text-gray-700">{value || '—'}</p>
    </div>
  ))}
</div>
        </div>

        {/* Step indicators */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 mb-4">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <StepDot num={s.num} label={s.label} active={step === s.num} done={step > s.num} />
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded ${step > s.num ? 'bg-emerald-400' : 'bg-gray-100'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
          {stepError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4">{stepError}</div>}

          {/* ── Step 1 ── */}
          {step === 1 && (
            <div>
              <SectionTitle title="Please indicate the primary reason for Joining Invenger" subtitle="Tick whichever is relevant" />
              <div className="space-y-1">
                {[
                  { key: 'joined_for_benefits',   label: 'Benefits'                        },
                  { key: 'joined_for_career',     label: 'Career Advancements'             },
                  { key: 'joined_for_salary',     label: 'Salary'                          },
                  { key: 'joined_for_reputation', label: 'Reputation as a good place to work' },
                ].map(({ key, label }) => (
                  <Checkbox key={key} checked={form[key]} onChange={() => upd(key, !form[key])} label={label} />
                ))}
                <div className="flex items-center gap-3 mt-2">
                  <Checkbox checked={!!form.joined_for_other} onChange={() => upd('joined_for_other', form.joined_for_other ? '' : ' ')} label="Others:" />
                  <input type="text" value={form.joined_for_other} onChange={e => upd('joined_for_other', e.target.value)} placeholder="Please specify…" className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <SectionTitle title="Rating of Invenger" />
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  {[
                    { key: 'rating_company_benefits',   label: 'Company Benefits'                 },
                    { key: 'rating_salary',             label: 'Salary'                           },
                    { key: 'rating_working_conditions', label: 'Working Conditions'               },
                    { key: 'rating_advancement',        label: 'Advancement/Training Opportunity' },
                    { key: 'rating_others',             label: 'Others'                           },
                    { key: 'rating_overall',            label: 'Overall Rating'                   },
                  ].map(({ key, label }) => (
                    <RatingRow key={key} label={label} value={form[key]} onChange={v => upd(key, v)} choices={RATING_OPTS} />
                  ))}
                </div>
              </div>
              <div>
                <SectionTitle title="How would you describe communication?" />
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  {[
                    { key: 'comm_throughout_company',  label: 'Throughout the company'     },
                    { key: 'comm_managers_staff',      label: 'Between managers and staff' },
                    { key: 'comm_between_departments', label: 'Between departments'        },
                    { key: 'comm_within_department',   label: 'Within your department'     },
                  ].map(({ key, label }) => (
                    <RatingRow key={key} label={label} value={form[key]} onChange={v => upd(key, v)} choices={RATING_OPTS} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <div className="space-y-5">
              <SectionTitle title="Your Experience at Invenger" subtitle="Please answer honestly — all responses are confidential." />
              <div className="space-y-4">
                {[
                  { key: 'position_represented_properly',    label: 'Was the position you were hired for represented properly at the interview?' },
                  { key: 'salary_competitive',               label: 'Was your salary competitive?'                                               },
                  { key: 'position_met_expectations',        label: 'Did this position meet your initial expectation of the job?'                },
                  { key: 'satisfied_performance_mgmt',       label: 'Were you satisfied with your performance management process?'               },
                  { key: 'enjoyed_work',                     label: 'Did you enjoy your work?'                                                   },
                  { key: 'work_hours_reasonable',            label: 'Were your work hours reasonable?'                                           },
                  { key: 'workload_reasonable',              label: 'Was your workload reasonable?'                                              },
                  { key: 'sufficient_resources',             label: 'Were you provided sufficient resources to perform your job?'                },
                  { key: 'familiar_disciplinary_procedures', label: 'Were you familiar with the disciplinary procedures of the department?'      },
                  { key: 'sufficient_professional_dev',      label: 'Were you provided sufficient opportunity for professional development?'     },
                  { key: 'satisfied_training_quality',       label: 'Were you satisfied with the quality of training given during your employment?' },
                  { key: 'supervisors_helpful',              label: 'Were your supervisors/superiors helpful?'                                   },
                  { key: 'would_recommend',                  label: 'Would you recommend Invenger as a place of employment?'                     },
                  { key: 'would_rejoin',                     label: 'Would you consider being rehired by Invenger in the future?'                },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <p className="text-sm text-gray-700 font-medium">{label}</p>
                    <YesNo value={form[key]} onChange={v => upd(key, v)} />
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-2 border-t border-gray-100">
                {[
                  { key: 'enjoyed_most',          label: 'What did you enjoy most about your job at Invenger?' },
                  { key: 'enjoyed_least',         label: 'What did you enjoy least about Invenger?' },
                  { key: 'positive_aspects',      label: 'Explain other aspects that positively affected your work performance.' },
                  { key: 'job_importance_extent', label: 'To what extent did others treat your job as important and significant?' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-sm text-gray-700 font-medium block">{label}</label>
                    <TextArea value={form[key]} onChange={v => upd(key, v)} placeholder="Your answer…" />
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-2 border-t border-gray-100">
                {[
                  { key: 'environment_rating',      label: 'How did you feel about the environment for Invenger employees to work in?' },
                  { key: 'morale_rating',           label: 'How was the morale in your area?' },
                  { key: 'coworker_relationship',   label: 'What sort of relationships did you have with your co-workers?' },
                  { key: 'supervisor_relationship', label: 'What sort of relationship did you have with your supervisors?' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <p className="text-sm text-gray-700 font-medium mb-2">{label}</p>
                    <div className="flex gap-2 flex-wrap">
                      {SCALE_OPTS.map(({ val, label: lbl }) => (
                        <button key={val} type="button" onClick={() => upd(key, val)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                            form[key] === val ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'
                          }`}>
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4 ── */}
          {step === 4 && (
            <div>
              <SectionTitle title="Please indicate your primary reason for leaving Invenger" subtitle="You may select more than one" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {[
                  { key: 'left_better_compensation',     label: 'Better Compensation'         },
                  { key: 'left_better_designation',      label: 'Better Designation'          },
                  { key: 'left_better_benefits',         label: 'Better Benefits'             },
                  { key: 'left_better_job_opportunity',  label: 'Better Job Opportunity'      },
                  { key: 'left_better_working_conditions',label: 'Better Working Conditions'  },
                  { key: 'left_lack_of_recognition',     label: 'Lack of Recognition for Work'},
                  { key: 'left_commuting_distance',      label: 'Commuting Distance'          },
                  { key: 'left_difficult_supervisor',    label: 'Difficult with Supervisor'   },
                  { key: 'left_no_advancement',          label: 'No Advancement in Profile'   },
                  { key: 'left_family_circumstances',    label: 'Family Circumstances'        },
                  { key: 'left_moving_out_of_town',      label: 'Moving out of Town'          },
                  { key: 'left_illness',                 label: 'Illness'                     },
                  { key: 'left_retirement',              label: 'Retirement'                  },
                  { key: 'left_self_employment',         label: 'Self-Employment'             },
                ].map(({ key, label }) => (
                  <Checkbox key={key} checked={form[key]} onChange={() => upd(key, !form[key])} label={label} />
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100">
                <label className="text-sm font-medium text-gray-700 block mb-1">Which one factor was the most important in your decision to leave?</label>
                <TextArea value={form.most_important_factor} onChange={v => upd('most_important_factor', v)} placeholder="Please describe…" rows={3} />
              </div>
            </div>
          )}

          {/* ── Step 5 ── */}
          {step === 5 && (
            <div className="space-y-6">
              <SectionTitle title="Final Questions" subtitle="Your feedback helps us improve for future employees." />
              {[
                { key: 'could_prevent_leaving',       detailKey: 'could_prevent_leaving_details', label: 'Is there anything that could have been done to prevent your leaving?' },
                { key: 'suggestions_for_improvement', detailKey: 'suggestions_details',           label: 'Do you have suggestions for change or improvement?' },
                { key: 'anything_else',               detailKey: 'anything_else_details',         label: "Is there anything you would like us to know that we haven't asked?" },
              ].map(({ key, detailKey, label }) => (
                <div key={key}>
                  <p className="text-sm font-medium text-gray-700">{label}</p>
                  <YesNo value={form[key]} onChange={v => upd(key, v)} />
                  {form[key] === true && (
                    <TextArea value={form[detailKey]} onChange={v => upd(detailKey, v)} placeholder="Please elaborate…" rows={3} />
                  )}
                </div>
              ))}
              <div>
  <label className="text-sm font-medium text-gray-700 block mb-2">
    Last Project Worked
  </label>

  <TextArea
    value={form.last_project_worked}
    onChange={(v) => upd('last_project_worked', v)}
    placeholder="Enter the last project worked on"
    rows={3}
  />
</div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4">
                <p className="text-xs text-blue-600 font-medium leading-relaxed">
                  By submitting, you confirm that your responses are honest and voluntary. This form is confidential — Doc: INV/HR/EIQ/v1.0
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
            <button onClick={handleBack} disabled={step === 1} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={15} /> Back
            </button>
            <span className="text-xs text-gray-400 font-medium">Step {step} of {STEPS.length}</span>
            {step < STEPS.length ? (
              <button onClick={handleNext} className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">
                Next <ChevronRight size={15} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-bold rounded-xl transition-colors">
                {submitting ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />} {submitting ? 'Submitting…' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}