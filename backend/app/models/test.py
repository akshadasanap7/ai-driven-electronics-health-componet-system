from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, func
from app.database.database import Base

class Test(Base):
    __tablename__ = "tests"
    id = Column(Integer, primary_key=True, index=True)
    component_id = Column(Integer, ForeignKey("components.id"), nullable=True)
    component_type = Column(String, nullable=False)
    test_type = Column(String, nullable=False)
    expected_value = Column(Float, nullable=True)
    tolerance = Column(Float, default=5.0)
    status = Column(String, default="created")  # created, running, completed, failed
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())
