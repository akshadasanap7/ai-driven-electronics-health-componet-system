from sqlalchemy.orm import Session
from app.models.test import Test
from app.models.measurement import Measurement
from app.models.diagnosis import Diagnosis
from typing import Dict, Any

def generate_report(db: Session, test_id: int) -> Dict[str, Any]:
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise ValueError("Test not found")

    measurements = (
        db.query(Measurement)
        .filter(Measurement.test_id == test_id)
        .order_by(Measurement.timestamp)
        .all()
    )
    diagnosis = db.query(Diagnosis).filter(Diagnosis.test_id == test_id).first()

    latest = measurements[-1] if measurements else None

    return {
        "test_id": test.id,
        "component_type": test.component_type,
        "test_type": test.test_type,
        "status": test.status,
        "expected_value": test.expected_value,
        "tolerance": test.tolerance,
        "started_at": test.started_at.isoformat() if test.started_at else None,
        "completed_at": test.completed_at.isoformat() if test.completed_at else None,
        "measurement_count": len(measurements),
        "latest_measurement": {
            "voltage": latest.voltage if latest else None,
            "current": latest.current if latest else None,
            "resistance": latest.resistance if latest else None,
            "capacitance": latest.capacitance if latest else None,
            "temperature": latest.temperature if latest else None,
        } if latest else None,
        "measurements": [
            {
                "voltage": m.voltage,
                "current": m.current,
                "resistance": m.resistance,
                "capacitance": m.capacitance,
                "temperature": m.temperature,
                "timestamp": m.timestamp.isoformat(),
            }
            for m in measurements
        ],
        "diagnosis": {
            "health_score": diagnosis.health_score,
            "status": diagnosis.status,
            "fault_detected": diagnosis.fault_detected,
            "fault_type": diagnosis.fault_type,
            "recommendation": diagnosis.recommendation,
            "deviation_percentage": diagnosis.deviation_percentage,
        } if diagnosis else None,
    }
