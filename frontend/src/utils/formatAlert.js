/**
 * NEREID — Alert Data Formatter
 * Formats raw alert API response for display.
 */

export function formatAlert(raw) {
  return {
    id: raw.id,
    zoneId: raw.zone_id,
    score: raw.score || 0,
    signals: Array.isArray(raw.signals) ? raw.signals : [],
    zScores: raw.z_scores || {},
    narrative: raw.narrative || 'No narrative available',
    status: raw.status || 'active',
    createdAt: raw.created_at || '',
  };
}

export function formatAlerts(rawList) {
  return (rawList || []).map(formatAlert);
}
