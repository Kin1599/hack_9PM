from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_session
from .service import get_houses, get_streets, get_bus_stops, get_metro_exits, get_problem_zones, get_optimal_route, get_stage_changes

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