export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const INITIAL = {
  // Section 2
  joined_for_benefits: false, joined_for_career: false,
  joined_for_salary: false, joined_for_reputation: false, joined_for_other: '',
  // Section 3
  rating_company_benefits: '', rating_salary: '', rating_working_conditions: '',
  rating_advancement: '', rating_others: '', rating_overall: '',
  // Section 4
  comm_throughout_company: '', comm_managers_staff: '',
  comm_between_departments: '', comm_within_department: '',
  // Section 5
  position_represented_properly: null, salary_competitive: null,
  position_met_expectations: null, satisfied_performance_mgmt: null,
  enjoyed_work: null, work_hours_reasonable: null, workload_reasonable: null,
  sufficient_resources: null, familiar_disciplinary_procedures: null,
  sufficient_professional_dev: null, satisfied_training_quality: null,
  supervisors_helpful: null, would_recommend: null, would_rejoin: null,
  // Section 6
  enjoyed_most: '', enjoyed_least: '', positive_aspects: '',
  job_importance_extent: '', environment_rating: '', morale_rating: '',
  coworker_relationship: '', supervisor_relationship: '',
  // Section 7
  left_better_compensation: false, left_better_designation: false,
  left_better_benefits: false, left_better_job_opportunity: false,
  left_better_working_conditions: false, left_lack_of_recognition: false,
  left_commuting_distance: false, left_difficult_supervisor: false,
  left_no_advancement: false, left_family_circumstances: false,
  left_moving_out_of_town: false, left_illness: false,
  left_retirement: false, left_self_employment: false,
  // Section 8
  most_important_factor: '', could_prevent_leaving: null,
  could_prevent_leaving_details: '', suggestions_for_improvement: null,
  suggestions_details: '', anything_else: null, anything_else_details: '',
};

export const RATING_OPTS  = [
  { val: 'excellent', label: 'Excellent' },
  { val: 'good',      label: 'Good'      },
  { val: 'fair',      label: 'Fair'      },
  { val: 'poor',      label: 'Poor'      },
];

export const SCALE_OPTS = [
  { val: 'very_good', label: 'Very Good' },
  { val: 'good',      label: 'Good'      },
  { val: 'average',   label: 'Average'   },
  { val: 'poor',      label: 'Poor'      },
];

export const STEPS = [
  { num: 1, label: 'Joining'       },
  { num: 2, label: 'Ratings'       },
  { num: 3, label: 'Experience'    },
  { num: 4, label: 'Reason'        },
  { num: 5, label: 'Final'         },
];