import { useState, useEffect, useCallback, useRef } from "react";
import { getDepartments } from "../api/departments";

// Module-level cache — shared across all hook instances
let _cache     = null;
let _cacheTime = 0;
let _inflight  = null;          // in-flight promise lock
const CACHE_TTL = 300_000;      // 5 minutes

export const useDepartments = () => {
  const [departments, setDepartments] = useState(_cache ?? []);
  const [loading, setLoading]         = useState(!_cache);
  const abortRef                      = useRef(null);

  const fetchDepartments = useCallback(async (force = false) => {
    const now = Date.now();

    // 1. Return cache if still fresh
    if (!force && _cache && now - _cacheTime < CACHE_TTL) {
      setDepartments(_cache);
      setLoading(false);
      return;
    }

    // 2. If another instance is already fetching, wait for it
    if (_inflight) {
      try {
        const result = await _inflight;
        setDepartments(result);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
      return;
    }

    // 3. We are the first — fire the request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    _inflight = getDepartments()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
        _cache      = data;
        _cacheTime  = Date.now();
        _inflight   = null;
        return data;
      })
      .catch(() => {
        _inflight = null;
        return _cache ?? [];
      });

    try {
      const data = await _inflight;
      if (!controller.signal.aborted) setDepartments(data);
    } catch (err) {
      if (!controller.signal.aborted)
        console.error("useDepartments error:", err);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    _cache    = null;
    _inflight = null;
    fetchDepartments(true);
  }, [fetchDepartments]);

  useEffect(() => {
    fetchDepartments();
    return () => abortRef.current?.abort();
  }, [fetchDepartments]);

  return { departments, loading, refetch };
};