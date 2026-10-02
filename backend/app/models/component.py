from sqlalchemy import Column, Integer, String, DateTime, func
from app.database.database import Base

class Component(Base):
    __tablename__ = "components"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    description = Column(String)
    created_at = Column(DateTime, default=func.now())
