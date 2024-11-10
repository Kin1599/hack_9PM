import geopandas as gpd
from typing import List
from .utils import convert_to_geojson, filter_by_bounds

def get_houses(bounds: List[float], stage: str):
    """
    Возвращает дома для заданной стадии, фильтруя по границам и стадии.
    stage: str - стадия, по которой выбирается файл.
    """

    if stage == "stage1":
        house_df = gpd.read_file('./../../data/vectors/House_1очередь_ЖК.shp')
    elif stage == "stage2":
        house_df = gpd.read_file('./../../data/vectors/House_2очередь_ЖК.shp')
    elif stage == "stage3":
        house_df = gpd.read_file('./../../data/vectors/House_3очередь_ЖК.shp')
    else:
        raise ValueError(f"Unknown stage: {stage}")
    
    geojson_data = convert_to_geojson(house_df)

    filtered_features = filter_by_bounds(geojson_data['features'], bounds)    

    return {
        "type": "FeatureCollection",
        "features": filtered_features
    }

def get_streets(bounds: List[float], stage: str):
    """
    Возвращает информацию о улицах для заданной стадии строительства, фильтруя по географическим границам.

    Эта функция загружает данные о улицах для заданной стадии (stage) из соответствующего shapefile,
    а затем фильтрует эти данные по указанным географическим границам.

    :param bounds: Список из четырех чисел (xmin, ymin, xmax, ymax), которые представляют
                   географические границы для фильтрации улиц.
                   Пример: [37.5, 55.5, 38.0, 55.9]
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
    
    if stage == "stage1":
        street_df = gpd.read_file('./../../data/vectors/Streets_1очередь.shp')
    elif stage == "stage2":
        street_df = gpd.read_file('./../../data/vectors/Streets_2очередь.shp')
    elif stage == "stage3":
        street_df = gpd.read_file('./../../data/vectors/Streets_3очередь.shp')
    else:
        raise ValueError(f"Unknown stage: {stage}")
    
    geojson_data = convert_to_geojson(street_df)

    filtered_features = filter_by_bounds(geojson_data['features'], bounds)    

    return {
        "type": "FeatureCollection",
        "features": filtered_features
    }


def get_bus_stops(bounds: List[float]):
    """
    Возвращает информацию об автобусных остановках, фильтруя по заданным границам.

    :param bounds: Список из четырех чисел (xmin, ymin, xmax, ymax), которые представляют
                   географические границы для фильтрации автобусных остановок.
    :return: Словарь в формате GeoJSON с отфильтрованными автобусными остановками.
             Формат ответа:
             {
                 "type": "FeatureCollection",
                 "features": [...]
             }
    """    
    bus_df = gpd.read_file('./../../data/vectors/Остановки_ОТ.shp')
    
    geojson_data = convert_to_geojson(bus_df)

    filtered_features = filter_by_bounds(geojson_data['features'], bounds)  
    # filtered_features = geojson_data['features']  

    return {
        "type": "FeatureCollection",
        "features": filtered_features
    }

def get_metro_exits(bounds: List[float]):
    """
    Возвращает информацию о выходах из метро, фильтруя по заданным границам.

    :param bounds: Список из четырех чисел (xmin, ymin, xmax, ymax), которые представляют
                   географические границы для фильтрации выходов из метро.
    :return: Словарь в формате GeoJSON с отфильтрованными выходами из метро.
             Формат ответа:
             {
                 "type": "FeatureCollection",
                 "features": [...]
             }
    """
    metro_df = gpd.read_file('./../../data/vectors/Выходы_метро.shp')
    
    geojson_data = convert_to_geojson(metro_df)

    filtered_features = filter_by_bounds(geojson_data['features'], bounds) 

    # filtered_features = geojson_data['features']   

    return {
        "type": "FeatureCollection",
        "features": filtered_features
    }

def get_problem_zones(bounds: List[float], stage: str):
    pass

def get_optimal_route(targetA: list, targetB: list):
    pass

def get_stage_changes(bounds: List[float], stage: str):
    pass