from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.test import TestCreate, TestResponse
from app.services import test_service
from typing import List

router = APIRouter(prefix="/api/tests", tags=["tests"])

@router.post("", response_model=TestResponse)
def create_test(data: TestCreate, db: Session = Depends(get_db)):
    try:
        return test_service.create_test(db, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("", response_model=List[TestResponse])
def list_tests(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return test_service.get_all_tests(db, skip, limit)

@router.get("/{test_id}", response_model=TestResponse)
def get_test(test_id: int, db: Session = Depends(get_db)):
    test = test_service.get_test(db, test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    return test

@router.post("/{test_id}/start", response_model=TestResponse)
def start_test(test_id: int, db: Session = Depends(get_db)):
    try:
        return test_service.start_test(db, test_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
