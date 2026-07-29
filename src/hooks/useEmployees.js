import { useState, useEffect, useCallback, useRef } from "react";
import { getEmployees } from "../api/employees";

export const useEmployees = (filters = {}) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const abortRef                  = useRef(null);

  const fetchEmployees = useCallback(async () => {
    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller   = new AbortController();
    abortRef.current   = controller;

    setLoading(true);
    try {
      // Strip empty filter values so the URL stays clean
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "" && v !== null && v !== undefined)
      );
      const res = await getEmployees(cleanFilters);
      if (!controller.signal.aborted) {
        setEmployees(Array.isArray(res.data) ? res.data : res.data?.results ?? []);
        setError(null);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        console.error("useEmployees error:", err);
        setError(err);
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [JSON.stringify(filters)]);  // stable dep

  useEffect(() => {
    fetchEmployees();
    return () => abortRef.current?.abort();
  }, [fetchEmployees]);

  return { employees, loading, error, refetch: fetchEmployees };
};