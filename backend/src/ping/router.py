from fastapi import APIRouter, Query
from .service import get_houses, get_streets, get_bus_stops, get_metro_exits, get_problem_zones, get_optimal_route, get_stage_changes
from typing import List

router = APIRouter()

@router.get('/ping')
def ping():
    return "pong"

@router.get("/houses")
async def fetch_houses(bounds: str = Query(...), stage: str = Query(...)):
    """
    Получение домов по заданным границам и стадии.
    bounds: Список координат границ, передаваемых в виде query-параметров (например, ?bounds=1,2,3,4).
    stage: Строка, определяющая стадию (например, "stage1", "stage2", "stage3").
    """
    
    bounds_list = list(map(float, bounds.split(',')))
    return get_houses(bounds_list, stage)

@router.get("/streets")
async def fetch_streets(bounds: str = Query(...), stage: str = Query(...)):
    """
    Получение данных о улицах для заданной стадии строительства, фильтруя по географическим границам.

    Этот эндпоинт позволяет получить информацию о улицах для указанной стадии строительства, 
    отфильтрованных по географическим границам. Пользователь должен указать параметры границ (bounds) 
    и стадию (stage) для правильной фильтрации данных.

    :param bounds: Список из четырех чисел (xmin, ymin, xmax, ymax), которые представляют
                   географические границы для фильтрации улиц. Например: [37.5, 55.5, 38.0, 55.9].
    :param stage: Строка, определяющая стадию строительства, для которой выбирается файл.
                  Возможные значения: "stage1", "stage2", "stage3".
    :return: Словарь в формате GeoJSON с отфильтрованными улицами для указанной стадии.
             Формат ответа:
             {
                 "type": "FeatureCollection",
                 "features": [...]
             }
    :raises ValueError: Если указанная стадия не соответствует допустимым значениям ("stage1", "stage2", "stage3").
    """
    bounds_list = list(map(float, bounds.split(',')))
    return get_streets(bounds_list, stage)

@router.get("/bus_stops")
async def fetch_bus_stops(bounds: str = Query(...)):
    """
    Получение данных об автобусных остановках в заданных географических границах.

    Этот эндпоинт позволяет получить информацию о автобусных остановках, которые находятся внутри
    заданных границ (xmin, ymin, xmax, ymax). Данные отфильтровываются на основе этих координат.

    :param bounds: Список из четырех чисел (xmin, ymin, xmax, ymax), которые представляют
                   географические границы для фильтрации автобусных остановок.
                   Пример: [37.5, 55.5, 38.0, 55.9]
    :return: Словарь в формате GeoJSON с отфильтрованными автобусными остановками.
             Формат ответа:
             {
                 "type": "FeatureCollection",
                 "features": [...]
             }
    """
    bounds_list = list(map(float, bounds.split(',')))
    return get_bus_stops(bounds_list)

@router.get("/metro_exits")
async def fetch_metro_exits(bounds: str = Query(...)):
    """
    Получение данных о выходах из метро в заданных географических границах.

    Этот эндпоинт позволяет получить информацию о выходах из метро, которые находятся внутри
    заданных границ (xmin, ymin, xmax, ymax). Данные отфильтровываются на основе этих координат.

    :param bounds: Список из четырех чисел (xmin, ymin, xmax, ymax), которые представляют
                   географические границы для фильтрации выходов метро.
                   Пример: [37.5, 55.5, 38.0, 55.9]
    :return: Словарь в формате GeoJSON с отфильтрованными выходами метро.
             Формат ответа:
             {
                 "type": "FeatureCollection",
                 "features": [...]
             }
    """
    bounds_list = list(map(float, bounds.split(',')))
    return get_metro_exits(bounds_list)

@router.get("/problem_zones")
async def fetch_problem_zones(bounds: List[float], stage: str):
    return get_problem_zones(stage)

@router.get("/optimal_route")
async def fetch_optimal_route(bounds: List[float], targetA: list, targetB: list):
    return get_optimal_route(targetA, targetB)

@router.get("/stage_changes")
async def fetch_stage_changes(bounds: List[float], stage: str):
    return get_stage_changes(stage)
