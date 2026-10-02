"""Seed realistic demo data so the dashboard is not empty on first launch."""
from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session
from app.models.test import Test
from app.models.measurement import Measurement
from app.models.diagnosis import Diagnosis

SEED_TESTS = [
    {"component_type": "resistor", "test_type": "resistance", "expected_value": 100.0, "tolerance": 5.0,
     "measured": 98.7, "status": "healthy", "health_score": 97.4, "fault": False, "fault_type": None,
     "rec": "Component is operating within specification. No action required."},
    {"component_type": "resistor", "test_type": "resistance", "expected_value": 220.0, "tolerance": 5.0,
     "measured": 248.0, "status": "fault", "health_score": 47.3, "fault": True,
     "fault_type": "Resistance value above tolerance — possible degradation or open circuit",
     "rec": "Component is outside acceptable tolerance. Replace the component before use in a circuit."},
    {"component_type": "capacitor", "test_type": "capacitance", "expected_value": 100.0, "tolerance": 10.0,
     "measured": 98.4, "status": "healthy", "health_score": 96.8, "fault": False, "fault_type": None,
     "rec": "Component is operating within specification. No action required."},
    {"component_type": "capacitor", "test_type": "capacitance", "expected_value": 47.0, "tolerance": 10.0,
     "measured": 39.2, "status": "warning", "health_score": 74.8, "fault": True,
     "fault_type": "Capacitance below tolerance — possible electrolyte dry-out or aging",
     "rec": "Component shows a measurable deviation from its reference value. Monitor the component or replace it."},
    {"component_type": "diode", "test_type": "forward_voltage", "expected_value": 0.7, "tolerance": 10.0,
     "measured": 0.68, "status": "healthy", "health_score": 94.3, "fault": False, "fault_type": None,
     "rec": "Component is operating within specification. No action required."},
    {"component_type": "transistor", "test_type": "vbe", "expected_value": 0.65, "tolerance": 10.0,
     "measured": 0.72, "status": "warning", "health_score": 78.5, "fault": True,
     "fault_type": "Vbe too high — possible degradation",
     "rec": "Component shows a measurable deviation from its reference value. Monitor the component or replace it."},
    {"component_type": "ic", "test_type": "supply_voltage", "expected_value": 5.0, "tolerance": 5.0,
     "measured": 4.98, "status": "healthy", "health_score": 99.2, "fault": False, "fault_type": None,
     "rec": "Component is operating within specification. No action required."},
    {"component_type": "resistor", "test_type": "resistance", "expected_value": 1000.0, "tolerance": 1.0,
     "measured": 1012.0, "status": "fault", "health_score": 52.0, "fault": True,
     "fault_type": "Resistance value above tolerance — possible degradation or open circuit",
     "rec": "Component is outside acceptable tolerance. Replace the component before use in a circuit."},
]

def seed(db: Session):
    if db.query(Test).count() > 0:
        return  # Already seeded

    base_time = datetime.utcnow() - timedelta(days=7)
    for i, s in enumerate(SEED_TESTS):
        created = base_time + timedelta(hours=i * 6)
        test = Test(
            component_type=s["component_type"],
            test_type=s["test_type"],
            expected_value=s["expected_value"],
            tolerance=s["tolerance"],
            status="completed",
            started_at=created,
            completed_at=created + timedelta(seconds=30),
            created_at=created,
        )
        db.add(test)
        db.flush()

        # Add 10 measurements per test
        for j in range(10):
            noise = random.gauss(0, 0.5)
            db.add(Measurement(
                test_id=test.id,
                voltage=round(3.3 + random.gauss(0, 0.02), 4),
                current=round(0.033 + random.gauss(0, 0.001), 4),
                resistance=round(s["measured"] + noise * 0.1, 4),
                capacitance=s["measured"] if s["component_type"] == "capacitor" else None,
                temperature=round(25.0 + random.gauss(0, 0.3), 2),
                timestamp=created + timedelta(seconds=j * 3),
            ))

        db.add(Diagnosis(
            test_id=test.id,
            health_score=s["health_score"],
            status=s["status"],
            fault_detected=s["fault"],
            fault_type=s["fault_type"],
            recommendation=s["rec"],
            deviation_percentage=round(abs(s["measured"] - s["expected_value"]) / s["expected_value"] * 100, 3),
            created_at=created + timedelta(seconds=30),
        ))

    db.commit()
