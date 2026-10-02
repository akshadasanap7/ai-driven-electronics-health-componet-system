from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TestCreate(BaseModel):
    component_type: str
    test_type: str
    expected_value: Optional[float] = None
    tolerance: Optional[float] = 5.0

class TestResponse(BaseModel):
    id: int
    component_type: str
    test_type: str
    expected_value: Optional[float]
    tolerance: float
    status: str
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
