from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MeasurementResponse(BaseModel):
    id: int
    test_id: int
    voltage: Optional[float]
    current: Optional[float]
    resistance: Optional[float]
    capacitance: Optional[float]
    temperature: Optional[float]
    timestamp: datetime

    class Config:
        from_attributes = True
