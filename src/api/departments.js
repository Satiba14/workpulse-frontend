import api from "./axios";

export const getDepartments = () =>
  api.get("/departments/");

export const getDepartmentById = (id) =>
  api.get(`/departments/${id}/`);

// Backend DepartmentCreateSerializer expects: { name, parent_department }
// parent_department is the FK id (UUID) or null
export const createDepartment = (data) =>
  api.post("/departments/", data);

export const updateDepartment = (id, data) =>
  api.put(`/departments/${id}/`, data);

export const deleteDepartment = (id) =>
  api.delete(`/departments/${id}/`);