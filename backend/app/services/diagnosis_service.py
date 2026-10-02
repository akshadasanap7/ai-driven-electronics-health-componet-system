from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.diagnosis import Diagnosis
from app.models.test import Test
from app.models.measurement import Measurement
from app.ai.diagnosis_engine import run_rule_based_diagnosis

def run_diagnosis(db: Session, test_id: int) -> Diagnosis:
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise ValueError("Test not found")

    # Use latest measurement
    latest = (
        db.query(Measurement)
        .filter(Measurement.test_id == test_id)
        .order_by(Measurement.timestamp.desc())
        .first()
    )
    if not latest:
        raise ValueError("No measurements available for diagnosis")

    measurements = {
        "voltage": latest.voltage,
        "current": latest.current,
        "resistance": latest.resistance,
        "capacitance": latest.capacitance,
        "temperature": latest.temperature,
    }

    result = run_rule_based_diagnosis(
        component_type=test.component_type,
        measurements=measurements,
        expected_value=test.expected_value,
        tolerance=test.tolerance,
    )

    # Remove existing diagnosis for this test
    db.query(Diagnosis).filter(Diagnosis.test_id == test_id).delete()

    diag = Diagnosis(
        test_id=test_id,
        health_score=result["health_score"],
        status=result["status"],
        fault_detected=result["fault_detected"],
        fault_type=result["fault_type"],
        recommendation=result["recommendation"],
        deviation_percentage=result["deviation_percentage"],
        created_at=datetime.utcnow(),
    )
    db.add(diag)

    # Mark test completed
    test.status = "completed"
    test.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(diag)
    return diag

def get_diagnosis(db: Session, test_id: int) -> Optional[Diagnosis]:
    return db.query(Diagnosis).filter(Diagnosis.test_id == test_id).first()
