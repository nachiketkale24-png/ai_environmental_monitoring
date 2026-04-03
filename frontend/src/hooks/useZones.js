import { useState, useEffect } from 'react';

const API_BASE = '/api';

export default function useZones() {
  const [zones, setZones] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await fetch(`${API_BASE}/zones`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setZones(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, []);

  return { zones, loading, error };
}
