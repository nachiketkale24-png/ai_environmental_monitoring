import { useState, useEffect, useCallback } from 'react';

const API_BASE = '/api';

export default function useAlerts(pollInterval = 60000) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/alerts?status=active&limit=50`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAlerts(data.alerts || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    const id = setInterval(fetchAlerts, pollInterval);
    return () => clearInterval(id);
  }, [fetchAlerts, pollInterval]);

  return { alerts, loading, error, refetch: fetchAlerts };
}
