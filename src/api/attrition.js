import api from './axios';

export const getAttritionStats = () =>
  api.get('/attrition/stats/');

export const getAttritionRecords = (params) =>
  api.get('/attrition/', { params });

export const getTopExitReasons = (params) =>
  api.get('/exit-reasons/top/', { params });