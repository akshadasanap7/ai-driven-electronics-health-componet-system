import random
import math
import time
from typing import Dict, Any, Optional
from app.hardware.stm32 import HardwareInterface

# Realistic component profiles for simulation
COMPONENT_PROFILES = {
    "resistor": {
        "resistance": {"nominal": 100.0, "noise": 0.5, "fault_drift": 25.0},
        "voltage": {"nominal": 3.3, "noise": 0.02},
        "current": {"nominal": 0.033, "noise": 0.001},
        "temperature": {"nominal": 25.0, "noise": 0.3},
        "capacitance": {"nominal": None, "noise": 0},
    },
    "capacitor": {
        "capacitance": {"nominal": 100.0, "noise": 2.0, "fault_drift": 30.0},
        "voltage": {"nominal": 5.0, "noise": 0.05},
        "current": {"nominal": 0.01, "noise": 0.002},
        "temperature": {"nominal": 25.0, "noise": 0.3},
        "resistance": {"nominal": None, "noise": 0},
    },
    "diode": {
        "voltage": {"nominal": 0.7, "noise": 0.01, "fault_drift": 0.3},
        "current": {"nominal": 0.02, "noise": 0.001},
        "resistance": {"nominal": 50.0, "noise": 2.0},
        "temperature": {"nominal": 25.0, "noise": 0.5},
        "capacitance": {"nominal": None, "noise": 0},
    },
    "transistor": {
        "voltage": {"nominal": 0.65, "noise": 0.01, "fault_drift": 0.2},
        "current": {"nominal": 0.05, "noise": 0.002},
        "resistance": {"nominal": 200.0, "noise": 5.0},
        "temperature": {"nominal": 25.0, "noise": 0.5},
        "capacitance": {"nominal": None, "noise": 0},
    },
    "ic": {
        "voltage": {"nominal": 5.0, "noise": 0.05},
        "current": {"nominal": 0.025, "noise": 0.002},
        "resistance": {"nominal": 1000.0, "noise": 10.0},
        "temperature": {"nominal": 28.0, "noise": 0.8},
        "capacitance": {"nominal": None, "noise": 0},
    },
}

class SimulatorHardware(HardwareInterface):
    """Realistic hardware simulator - generates plausible measurements with noise."""

    def __init__(self):
        self._connected = False
        self._running = False
        self._component_type = "resistor"
        self._test_type = "resistance"
        self._config = {}
        self._start_time = None
        self._inject_fault = False
        self._t = 0  # time step for gradual drift

    def connect(self) -> bool:
        self._connected = True
        return True

    def disconnect(self) -> None:
        self._connected = False
        self._running = False

    def start_test(self, component_type: str, test_type: str, config: Dict) -> bool:
        self._component_type = component_type.lower()
        self._test_type = test_type.lower()
        self._config = config
        self._running = True
        self._start_time = time.time()
        self._t = 0
        # ~20% chance of simulating a fault for realism
        self._inject_fault = random.random() < 0.2
        return True

    def read_measurements(self) -> Dict[str, Any]:
        if not self._running:
            return {}
        self._t += 1
        profile = COMPONENT_PROFILES.get(self._component_type, COMPONENT_PROFILES["resistor"])

        def _sample(key: str) -> Optional[float]:
            p = profile.get(key, {})
            nominal = p.get("nominal")
            if nominal is None:
                return None
            noise = p.get("noise", 0)
            # Gradual drift + sinusoidal noise for realistic chart movement
            drift = 0.0
            if self._inject_fault and "fault_drift" in p:
                drift = p["fault_drift"] * min(self._t / 20.0, 1.0)
            val = nominal + drift + random.gauss(0, noise) + math.sin(self._t * 0.3) * noise * 0.5
            return round(val, 4)

        voltage = _sample("voltage")
        current = _sample("current")
        resistance = _sample("resistance")

        # Derive resistance from V/I if not directly measured
        if resistance is None and voltage and current and current != 0:
            resistance = round(voltage / current, 4)

        return {
            "voltage": voltage,
            "current": current,
            "resistance": resistance,
            "capacitance": _sample("capacitance"),
            "temperature": _sample("temperature"),
        }

    def stop_test(self) -> None:
        self._running = False

    def get_status(self) -> Dict[str, Any]:
        return {
            "connected": self._connected,
            "running": self._running,
            "mode": "simulation",
            "fault_injected": self._inject_fault,
        }
