from sqlalchemy import Column, Integer, String
from ..database import Base

class House(Base):
    __tablename__ = "houses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    stage = Column(String, index=True)
    type = Column(String)
    floors = Column(Integer)