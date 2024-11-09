from sqlalchemy.orm import Session
from .models import House

# Филтр который мне скинул Дима
def get_houses(db: Session, bounds: list, stage: str):
    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "id": "house1",
                    "name": "Дом 1",
                    "stage": "stage1",
                    "type": "residential",
                    "floors": 12
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [[37.55, 55.75], [37.56, 55.76], [37.57, 55.75], [37.56, 55.74], [37.55, 55.75]]
                    ]
                }
            }
        ]
    }

def get_streets(db: Session, bounds: list, stage: str):
    pass

def get_bus_stops(db: Session, bounds: list, stage: str):
    pass

def get_metro_exits(db: Session, bounds: list, stage: str):
    pass

def get_problem_zones(db: Session, stage: str):
    pass

def get_optimal_route(db: Session, targetA: list, targetB: list):
    pass

def get_stage_changes(db: Session, stage: str):
    pass