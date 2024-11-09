from pydantic import BaseModel
from typing import List

class HouseSchema(BaseModel):
    id: int
    name: str
    stage: str
    type: str
    floors: int

    class Config:
        orm_mode = True