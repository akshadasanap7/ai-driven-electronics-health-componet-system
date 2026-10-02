from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database.database import get_db
from app.models.test import Test
from app.models.diagnosis import Diagnosis

router = APIRouter(prefix="/api", tags=["history"])

@router.get("/history")
def get_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tests = db.query(Test).order_by(desc(Test.created_at)).offset(skip).limit(limit).all()
    result = []
    for t in tests:
        diag = db.query(Diagnosis).filter(Diagnosis.test_id == t.id).first()
        result.append({
            "test_id": t.id,
            "component_type": t.component_type,
            "test_type": t.test_type,
            "status": t.status,
            "expected_value": t.expected_value,
            "tolerance": t.tolerance,
            "health_score": diag.health_score if diag else None,
            "diagnosis_status": diag.status if diag else None,
            "fault_detected": diag.fault_detected if diag else None,
            "created_at": t.created_at.isoformat() if t.created_at else None,
            "completed_at": t.completed_at.isoformat() if t.completed_at else None,
        })
    return result

@router.get("/components")
def get_components():
    return [
        {"id": 1, "type": "resistor", "name": "Resistor", "description": "Fixed resistor component"},
        {"id": 2, "type": "capacitor", "name": "Capacitor", "description": "Electrolytic/ceramic capacitor"},
        {"id": 3, "type": "diode", "name": "Diode", "description": "Signal/rectifier diode"},
        {"id": 4, "type": "transistor", "name": "Transistor", "description": "BJT/MOSFET transistor"},
        {"id": 5, "type": "ic", "name": "Digital IC", "description": "Logic gate / digital IC"},
    ]
