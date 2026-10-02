from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services import report_service

router = APIRouter(prefix="/api/tests", tags=["reports"])

@router.get("/{test_id}/report")
def get_report(test_id: int, db: Session = Depends(get_db)):
    try:
        return report_service.generate_report(db, test_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
