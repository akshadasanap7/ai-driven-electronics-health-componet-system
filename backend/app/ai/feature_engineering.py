import numpy as np
from typing import Dict, Any, Optional

def extract_features(measurements: Dict[str, Any], expected_value: Optional[float] = None) -> np.ndarray:
    """Extract ML-ready feature vector from raw measurements."""
    voltage = measurements.get("voltage") or 0.0
    current = measurements.get("current") or 0.0
    resistance = measurements.get("resistance") or 0.0
    capacitance = measurements.get("capacitance") or 0.0
    temperature = measurements.get("temperature") or 25.0

    vi_ratio = voltage / current if current != 0 else 0.0
    resistance_deviation = abs(resistance - expected_value) / expected_value if expected_value else 0.0
    temperature_deviation = max(0.0, temperature - 25.0)

    return np.array([
        voltage, current, resistance, capacitance, temperature,
        vi_ratio, resistance_deviation, temperature_deviation,
    ], dtype=np.float32)
