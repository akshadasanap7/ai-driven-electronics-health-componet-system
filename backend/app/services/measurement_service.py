from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.measurement import Measurement
from app.models.test import Test
from app.services.hardware_service import get_hardware

def acquire_measurement(db: Session, test_id: int) -> Measurement:
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test or test.status != "running":
        raise ValueError("Test is not running")

    hw = get_hardware()
    raw = hw.read_measurements()

    m = Measurement(
        test_id=test_id,
        voltage=raw.get("voltage"),
        current=raw.get("current"),
        resistance=raw.get("resistance"),
        capacitance=raw.get("capacitance"),
        temperature=raw.get("temperature"),
        timestamp=datetime.utcnow(),
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return m

def get_measurements(db: Session, test_id: int):
    return db.query(Measurement).filter(Measurement.test_id == test_id).order_by(Measurement.timestamp).all()

def get_latest_measurement(db: Session, test_id: int) -> Optional[Measurement]:
    return (
        db.query(Measurement)
        .filter(Measurement.test_id == test_id)
        .order_by(Measurement.timestamp.desc())
        .first()
    )
