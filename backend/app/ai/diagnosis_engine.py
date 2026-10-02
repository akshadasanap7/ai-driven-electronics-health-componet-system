from typing import Dict, Any, Optional, Tuple

# Fault type definitions per component
FAULT_TYPES = {
    "resistor": {
        "resistance_high": "Resistance value above tolerance — possible degradation or open circuit",
        "resistance_low": "Resistance value below tolerance — possible short or contamination",
        "temperature_high": "Elevated temperature — possible overload or thermal stress",
    },
    "capacitor": {
        "capacitance_low": "Capacitance below tolerance — possible electrolyte dry-out or aging",
        "capacitance_high": "Capacitance above tolerance — possible leakage or contamination",
        "esr_high": "High ESR detected — capacitor degradation",
        "temperature_high": "Elevated temperature — thermal stress",
    },
    "diode": {
        "vf_high": "Forward voltage too high — possible degradation",
        "vf_low": "Forward voltage too low — possible short circuit",
        "leakage": "Reverse leakage current detected",
        "open_circuit": "No conduction detected — open circuit",
    },
    "transistor": {
        "vbe_high": "Vbe too high — possible degradation",
        "vbe_low": "Vbe too low — possible short",
        "gain_low": "Current gain below specification",
        "leakage": "Collector leakage detected",
    },
    "ic": {
        "supply_voltage_low": "Supply voltage below specification",
        "supply_voltage_high": "Supply voltage above specification",
        "current_high": "Excessive supply current — possible internal fault",
        "output_fault": "Output logic levels incorrect",
    },
}

RECOMMENDATIONS = {
    "healthy": "Component is operating within specification. No action required.",
    "warning": (
        "Component shows a measurable deviation from its reference value. "
        "Monitor the component or replace it if the deviation exceeds the allowed tolerance."
    ),
    "fault": (
        "Component is outside acceptable tolerance. Replace the component before use in a circuit. "
        "Continued use may cause circuit malfunction."
    ),
}


def _get_primary_measured(component_type: str, measurements: Dict) -> Tuple[Optional[float], str]:
    """Return (primary_measured_value, parameter_name) for the component type."""
    mapping = {
        "resistor": ("resistance", measurements.get("resistance")),
        "capacitor": ("capacitance", measurements.get("capacitance")),
        "diode": ("voltage", measurements.get("voltage")),
        "transistor": ("voltage", measurements.get("voltage")),
        "ic": ("voltage", measurements.get("voltage")),
    }
    param, val = mapping.get(component_type, ("resistance", measurements.get("resistance")))
    return val, param


def run_rule_based_diagnosis(
    component_type: str,
    measurements: Dict[str, Any],
    expected_value: Optional[float],
    tolerance: float = 5.0,
) -> Dict[str, Any]:
    """
    Rule-based diagnosis engine.
    Returns health_score, status, fault_detected, fault_type, recommendation, deviation_percentage.
    """
    component_type = component_type.lower()
    measured, param = _get_primary_measured(component_type, measurements)
    temperature = measurements.get("temperature", 25.0)

    deviation_pct = None
    fault_type = None
    health_score = 100.0

    # Temperature check (universal)
    temp_fault = temperature is not None and temperature > 85.0
    if temp_fault:
        fault_type = "temperature_high"
        health_score -= 20

    if measured is not None and expected_value is not None and expected_value != 0:
        deviation_pct = abs(measured - expected_value) / abs(expected_value) * 100.0

        # Score degrades linearly with deviation
        score_penalty = min(deviation_pct * 2.0, 80.0)
        health_score = max(health_score - score_penalty, 0.0)

        # Determine fault type
        if deviation_pct > tolerance and fault_type is None:
            if measured > expected_value:
                fault_type = _high_fault(component_type, param)
            else:
                fault_type = _low_fault(component_type, param)
    elif measured is None:
        health_score = 0.0
        fault_type = "open_circuit"

    health_score = round(health_score, 1)

    if health_score >= 90:
        status = "healthy"
    elif health_score >= 70:
        status = "warning"
    else:
        status = "fault"

    fault_detected = status in ("warning", "fault")
    fault_description = None
    if fault_type:
        fault_description = FAULT_TYPES.get(component_type, {}).get(fault_type, fault_type.replace("_", " ").title())

    recommendation = RECOMMENDATIONS.get(status, RECOMMENDATIONS["healthy"])

    return {
        "health_score": health_score,
        "status": status,
        "fault_detected": fault_detected,
        "fault_type": fault_description,
        "recommendation": recommendation,
        "deviation_percentage": round(deviation_pct, 3) if deviation_pct is not None else None,
    }


def _high_fault(component_type: str, param: str) -> str:
    mapping = {
        "resistor": "resistance_high",
        "capacitor": "capacitance_high",
        "diode": "vf_high",
        "transistor": "vbe_high",
        "ic": "supply_voltage_high",
    }
    return mapping.get(component_type, f"{param}_high")


def _low_fault(component_type: str, param: str) -> str:
    mapping = {
        "resistor": "resistance_low",
        "capacitor": "capacitance_low",
        "diode": "vf_low",
        "transistor": "vbe_low",
        "ic": "supply_voltage_low",
    }
    return mapping.get(component_type, f"{param}_low")
