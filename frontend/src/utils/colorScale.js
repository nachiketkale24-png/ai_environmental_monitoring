/**
 * NEREID — Priority Color Scale
 * Maps alert scores to green/amber/red priority levels.
 */

export function getPriorityColor(score) {
  if (score >= 3.0) return 'red';
  if (score >= 2.0) return 'amber';
  return 'green';
}

export function getPriorityLabel(score) {
  if (score >= 3.0) return 'Critical';
  if (score >= 2.0) return 'Elevated';
  return 'Normal';
}

export function getPriorityHex(score) {
  if (score >= 3.0) return '#ef4444';
  if (score >= 2.0) return '#f59e0b';
  return '#22c55e';
}
