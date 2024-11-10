from sqlalchemy import Column, Float, Integer, String
from ..database import Base

class House(Base):
    __tablename__ = "houses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    stage = Column(String, index=True)
    type = Column(String)
    floors = Column(Integer)
    
class DataModel(Base):
    __tablename__ = "data"
    
    id = Column(Integer, primary_key=True, index=True) 
    lat = Column(Float, nullable=False)
    Lng = Column(Float, nullable=False)