"""
NEREID — ML Baseline
Prophet seasonal baseline fitting per zone/signal.
"""

import pandas as pd
from prophet import Prophet


def fit_baseline(df: pd.DataFrame, periods: int = 30) -> pd.DataFrame:
    """
    Fit a Prophet seasonal baseline on historical signal data.

    Args:
        df: DataFrame with columns 'ds' (datetime) and 'y' (value).
        periods: Number of future periods to forecast.

    Returns:
        DataFrame with columns: ds, yhat, yhat_lower, yhat_upper, y (actual).
    """
    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=False,
        daily_seasonality=False,
        changepoint_prior_scale=0.05,  # conservative for env signals
    )
    model.fit(df[["ds", "y"]])

    future = model.make_future_dataframe(periods=periods)
    forecast = model.predict(future)

    # Merge actuals back in
    result = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].merge(
        df[["ds", "y"]], on="ds", how="left"
    )

    return result


def compute_residuals(df: pd.DataFrame, forecast: pd.DataFrame) -> pd.Series:
    """
    Compute residuals (actual − predicted) aligned on date.
    """
    merged = df[["ds", "y"]].merge(
        forecast[["ds", "yhat"]], on="ds", how="inner"
    )
    return merged["y"] - merged["yhat"]
