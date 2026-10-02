from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, func
from app.database.database import Base

class Measurement(Base):
    __tablename__ = "measurements"
    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.id"), nullable=False)
    voltage = Column(Float, nullable=True)
    current = Column(Float, nullable=True)
    resistance = Column(Float, nullable=True)
    capacitance = Column(Float, nullable=True)
    temperature = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=func.now())
