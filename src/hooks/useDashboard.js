import { useState, useEffect, useRef } from "react";
import api from "../api/axios";

// All dashboard data fetched in ONE parallel round-trip
export const useDashboard = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const abortRef              = useRef(null);

  const fetchAll = async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    try {
      const [dashRes, attrRes] = await Promise.all([
        api.get("/dashboard/",         { signal: controller.signal }),
        api.get("/attrition/stats/",   { signal: controller.signal }),
      ]);

      if (!controller.signal.aborted) {
        setData({
          dashboard: dashRes.data,
          attrition: attrRes.data,
        });
        setError(null);
      }
    } catch(err) {
      if (!controller.signal.aborted) {
        console.error("useDashboard:", err);
        setError(err);
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    return () => abortRef.current?.abort();
  }, []);

  return { data, loading, error, refetch: fetchAll };
};