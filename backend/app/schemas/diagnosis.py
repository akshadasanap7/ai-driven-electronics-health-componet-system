from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DiagnosisResponse(BaseModel):
    id: int
    test_id: int
    health_score: float
    status: str
    fault_detected: bool
    fault_type: Optional[str]
    recommendation: Optional[str]
    deviation_percentage: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True
