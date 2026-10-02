from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.diagnosis import DiagnosisResponse
from app.services import diagnosis_service

router = APIRouter(prefix="/api/tests", tags=["diagnosis"])

@router.post("/{test_id}/diagnose", response_model=DiagnosisResponse)
def diagnose(test_id: int, db: Session = Depends(get_db)):
    try:
        return diagnosis_service.run_diagnosis(db, test_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{test_id}/diagnosis", response_model=DiagnosisResponse)
def get_diagnosis(test_id: int, db: Session = Depends(get_db)):
    diag = diagnosis_service.get_diagnosis(db, test_id)
    if not diag:
        raise HTTPException(status_code=404, detail="Diagnosis not found")
    return diag
