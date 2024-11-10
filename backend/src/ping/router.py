from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_session
from .service import get_houses, get_streets, get_bus_stops, get_metro_exits, get_problem_zones, get_optimal_route, get_stage_changes
from fastapi import APIRouter, Query
from typing import List, Dict
from .models import DataMode

router = APIRouter()

@router.get('/ping')
def ping():
    return "pong"

@router.get("/houses")
async def fetch_houses(bounds: list, stage: str, db: Session = Depends(get_session)):
    return get_houses(db, bounds, stage)

@router.get("/streets")
async def fetch_streets(bounds: list, stage: str, db: Session = Depends(get_session)):
    return get_streets(db, bounds, stage)

@router.get("/bus_stops")
async def fetch_bus_stops(bounds: list, stage: str, db: Session = Depends(get_session)):
    return get_bus_stops(db, bounds, stage)

@router.get("/metro_exits")
async def fetch_metro_exits(bounds: list, stage: str, db: Session = Depends(get_session)):
    return get_metro_exits(db, bounds, stage)

@router.get("/problem_zones")
async def fetch_problem_zones(stage: str, db: Session = Depends(get_session)):
    return get_problem_zones(db, stage)

@router.get("/optimal_route")
async def fetch_optimal_route(targetA: list, targetB: list, db: Session = Depends(get_session)):
    return get_optimal_route(db, targetA, targetB)

@router.get("/stage_changes")
async def fetch_stage_changes(stage: str, db: Session = Depends(get_session)):
    return get_stage_changes(db, stage)



def is_within_bounds(objLat, objLng, swLat, swLng, neLat, neLng):
    return swLat <= objLat <= neLat and swLng <= objLng <= neLng

@router.get("/api/getVisibleData")
def get_visible_data(
    swLat: float = Query(..., description="South-West Latitude"),
    swLng: float = Query(..., description="South-West Longitude"),
    neLat: float = Query(..., description="North-East Latitude"),
    neLng: float = Query(..., description="North-East Longitude"),
    db: Session = Depends(get_session)
):
    
    db_data = db.query(DataModel).all()
    
    # Фильтруем данные, которые находятся внутри видимой области bounds
    visible_data = [
        {"id": item.id, "lat": item.lat, "lng": item.lng}
        for item in db_data
        if is_within_bounds(item.lat, item.lng, swLat, swLng, neLat, neLng)
    ]
    
    return {"visible_data": visible_data}

