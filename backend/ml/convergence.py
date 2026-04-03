"""
NEREID — ML Convergence Gate
Multi-signal convergence check: alert only when ≥2 signals exceed threshold.
"""

from typing import Any


def check_convergence(
    z_scores: dict[str, float],
    threshold: float = 2.0,
    min_converging: int = 2,
) -> dict[str, Any]:
    """
    Check whether enough independent signals converge on an anomaly.

    An alert should only fire if at least `min_converging` signals
    simultaneously exceed the z-score `threshold`.

    Args:
        z_scores: Dict mapping signal name → current z-score.
        threshold: Z-score threshold for a signal to be considered anomalous.
        min_converging: Minimum number of signals that must agree.

    Returns:
        Dict with:
          - converged (bool): whether the gate is triggered
          - firing_signals (list): signals exceeding threshold
          - max_z (float): highest z-score among all signals
    """
    firing = {
        sig: z for sig, z in z_scores.items()
        if abs(z) >= threshold
    }

    return {
        "converged": len(firing) >= min_converging,
        "firing_signals": list(firing.keys()),
        "firing_z_scores": firing,
        "total_signals": len(z_scores),
        "max_z": max(abs(z) for z in z_scores.values()) if z_scores else 0.0,
    }
