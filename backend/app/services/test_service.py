from sqlalchemy.orm import Session
from datetime import datetime
from app.models.test import Test
from app.schemas.test import TestCreate
from app.services.hardware_service import get_hardware

# Safety limits
VOLTAGE_MAX = 30.0
CURRENT_MAX = 2.0
TEMP_MAX = 85.0

SUPPORTED_COMPONENTS = {"resistor", "capacitor", "diode", "transistor", "ic"}
SUPPORTED_TESTS = {
    "resistor": ["resistance", "voltage", "current"],
    "capacitor": ["capacitance", "voltage", "esr"],
    "diode": ["forward_voltage", "reverse_leakage", "iv_curve"],
    "transistor": ["vbe", "gain", "saturation"],
    "ic": ["supply_voltage", "current_consumption", "logic_levels"],
}

def validate_test(data: TestCreate) -> None:
    if data.component_type.lower() not in SUPPORTED_COMPONENTS:
        raise ValueError(f"Unsupported component: {data.component_type}")
    allowed = SUPPORTED_TESTS.get(data.component_type.lower(), [])
    if data.test_type.lower() not in allowed:
        raise ValueError(f"Test '{data.test_type}' not supported for {data.component_type}. Allowed: {allowed}")

def create_test(db: Session, data: TestCreate) -> Test:
    validate_test(data)
    test = Test(
        component_type=data.component_type.lower(),
        test_type=data.test_type.lower(),
        expected_value=data.expected_value,
        tolerance=data.tolerance or 5.0,
        status="created",
    )
    db.add(test)
    db.commit()
    db.refresh(test)
    return test

def start_test(db: Session, test_id: int) -> Test:
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise ValueError("Test not found")
    if test.status not in ("created", "failed"):
        raise ValueError(f"Cannot start test in status: {test.status}")

    hw = get_hardware()
    hw.start_test(test.component_type, test.test_type, {
        "expected_value": test.expected_value,
        "tolerance": test.tolerance,
    })

    test.status = "running"
    test.started_at = datetime.utcnow()
    db.commit()
    db.refresh(test)
    return test

def get_test(db: Session, test_id: int) -> Test:
    return db.query(Test).filter(Test.id == test_id).first()

def get_all_tests(db: Session, skip: int = 0, limit: int = 50):
    return db.query(Test).order_by(Test.created_at.desc()).offset(skip).limit(limit).all()
