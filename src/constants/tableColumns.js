// Employee table columns definition
export const EMPLOYEE_COLUMNS = [
  { key: 'name',        label: 'Name'       },
  { key: 'phone_no',    label: 'Phone'      },
  { key: 'department',  label: 'Department' },
  { key: 'joined_on',   label: 'Joined On'  },
  { key: 'status',      label: 'Status'     },
  { key: 'actions',     label: 'Actions'    },
];

// Department table columns
export const DEPARTMENT_COLUMNS = [
  { key: 'name',           label: 'Department Name' },
  { key: 'parent',         label: 'Parent Dept'     },
  { key: 'employee_count', label: 'Employees'       },
  { key: 'status',         label: 'Status'          },
  { key: 'actions',        label: 'Actions'         },
];

// Audit log columns
export const AUDIT_COLUMNS = [
  { key: 'user',       label: 'User'       },
  { key: 'action',     label: 'Action'     },
  { key: 'model_name', label: 'Module'     },
  { key: 'description',label: 'Description'},
  { key: 'timestamp',  label: 'Time'       },
];