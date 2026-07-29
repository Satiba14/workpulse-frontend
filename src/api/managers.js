import api from "./axios";

export const getManagers = () =>
  api.get("/managers/");

export const getDepartmentManager = (deptId) =>
  api.get(`/departments/${deptId}/manager/`);

export const assignManager = (deptId, empId) =>
  api.post("/managers/", { department: deptId, emp: empId });

export const removeManager = (deptId) =>
  api.delete(`/departments/${deptId}/manager/`);