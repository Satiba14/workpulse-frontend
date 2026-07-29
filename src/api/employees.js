import api from "./axios";

export const getEmployees = (params) =>
  api.get("/employees/", { params });

export const getEmployee = (id) =>
  api.get(`/employees/${id}/`);

export const getEmployeeById = (id) =>
  api.get(`/employees/${id}/`);

export const createEmployee = (data) => {
  // data is a plain object — send as JSON
  return api.post("/employees/", data);
};

export const updateEmployee = (id, data) => {
  // data can be plain object or FormData (if revision letter attached)
  const isFormData = data instanceof FormData;
  return api.put(`/employees/${id}/`, data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
};

export const deleteEmployee = (id) =>
  api.delete(`/employees/${id}/`);


export const uploadEmployeeDocument = (empId, formData) => {
  return api.post(`/employees/${empId}/documents/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Soft-delete an employee document.
 * @param {string} empId - Employee UUID (used in the URL path)
 * @param {string} docId - Document UUID to delete
 */
export const deleteEmployeeDocument = (empId, docId) => {
  return api.delete(`/employees/${empId}/documents/${docId}/`);
};