from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, ForeignKey, func
from app.database.database import Base

class Diagnosis(Base):
    __tablename__ = "diagnoses"
    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.id"), nullable=False)
    health_score = Column(Float, nullable=False)
    status = Column(String, nullable=False)  # healthy, warning, fault
    fault_detected = Column(Boolean, default=False)
    fault_type = Column(String, nullable=True)
    recommendation = Column(String, nullable=True)
    deviation_percentage = Column(Float, nullable=True)
    created_at = Column(DateTime, default=func.now())
