"""
NEREID — ML Z-Score Calculator
Rolling z-score computation on deviation from baseline.
"""

import numpy as np
import pandas as pd


def rolling_zscore(
    values: pd.Series | np.ndarray,
    window: int = 14,
    min_periods: int = 7,
) -> np.ndarray:
    """
    Compute a rolling z-score for a time series.

    Args:
        values: 1-D array of signal values (or residuals from baseline).
        window: Rolling window size in days.
        min_periods: Minimum observations in window to produce a value.

    Returns:
        Array of z-scores, same length as input (NaN-padded at start).
    """
    s = pd.Series(values)
    rolling_mean = s.rolling(window=window, min_periods=min_periods).mean()
    rolling_std = s.rolling(window=window, min_periods=min_periods).std()

    # Avoid division by zero
    rolling_std = rolling_std.replace(0, np.nan)

    z = (s - rolling_mean) / rolling_std
    return z.to_numpy()


def latest_zscore(values: pd.Series | np.ndarray, window: int = 14) -> float:
    """Return the most recent z-score value."""
    z = rolling_zscore(values, window=window)
    # Return last non-NaN value
    valid = z[~np.isnan(z)]
    return float(valid[-1]) if len(valid) > 0 else 0.0
