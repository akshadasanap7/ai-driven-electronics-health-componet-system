from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.measurement import MeasurementResponse
from app.services import measurement_service
from typing import List

router = APIRouter(prefix="/api/tests", tags=["measurements"])

@router.post("/{test_id}/measure", response_model=MeasurementResponse)
def acquire(test_id: int, db: Session = Depends(get_db)):
    try:
        return measurement_service.acquire_measurement(db, test_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{test_id}/measurements", response_model=List[MeasurementResponse])
def get_measurements(test_id: int, db: Session = Depends(get_db)):
    return measurement_service.get_measurements(db, test_id)
