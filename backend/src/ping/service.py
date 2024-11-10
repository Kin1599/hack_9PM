import geopandas as gpd
from typing import List
from .utils import convert_to_geojson, filter_by_bounds, add_edge_to_graph, find_nearest_nodes, find_nearest_build_for_houses
import networkx as nx
import json
from shapely.geometry import LineString, box
from collections import defaultdict
from pyproj import Transformer

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

def get_traffic_congestion(bounds: List[float], stage: str):
    """
    Возвращает информацию о нагруженности дорог, фильтруя по заданным границам и стадии.

    :param bounds: Географические границы для фильтрации данных.
    :param stage: Строка с стадией строительства, которая определяет, какой файл с дорогами и домами загрузить.
    :return: Словарь в формате GeoJSON с данными о нагруженности дорог.
    """
    street_df = gpd.read_file(r'C:\Dmitry\Universities\Hackaton\DigitalBreakthrough\data\\vectors\Streets_исходные.shp')
    house_df = gpd.read_file(r'C:\Dmitry\Universities\Hackaton\DigitalBreakthrough\data\\vectors\\Дома_исходные.shp')
    humon_road = street_df[street_df['Foot'] == 1]

    minx, miny, maxx, maxy = bounds
    bounding_box = box(minx, miny, maxx, maxy)
    house_df = house_df[house_df.within(bounding_box)]
    humon_road = humon_road[humon_road.within(bounding_box)]
    humon_road = humon_road[humon_road.within(bounding_box)]
    pesh_road = humon_road[humon_road['ROAD_CATEG'] == 'Пешеходные дорожки']
    
    school_gdf = house_df[house_df['Purpose'] == 'Школа']
    metro_gdf = house_df[house_df['Purpose'] == 'Метро']
    hospital_gdf = house_df[house_df['Purpose'] == 'Медицинское учреждение']
    sadik_gdf =  house_df[house_df['Purpose'] == 'Детский сад, ясли']
    House_data = house_df[(house_df['Purpose'] == "Жилой дом") | (house_df['Purpose'] == "Таунхаус") | (house_df['Purpose'] == "Коттедж") | (house_df['Purpose'] == "Частный дом") | (house_df['Purpose'] == 'Дома_новостройки')]
    House_data['Apartments'] = House_data['Apartments'].fillna(1)
    housePnt = [(House_data.iloc[i]['geometry'].centroid.x, House_data.iloc[i]['geometry'].centroid.y) for i in range(len(House_data))]
    HumonCnt = [House_data.iloc[i]['Apartments'] * 3 for i in range(len(House_data))]
    house_nodes = find_nearest_nodes(humon_road, housePnt)

    G = createGraph(humon_road)
    paths = []

    # Расчет ближайших узлов для различных типов зданий
    school_nodes = find_nearest_nodes(humon_road, school_Pnt) if len(school_gdf) > 0 else []
    metro_nodes = find_nearest_nodes(humon_road, metro_Pnt) if len(metro_gdf) > 0 else []
    sadik_nodes = find_nearest_nodes(humon_road, sadik_Pnt) if len(sadik_gdf) > 0 else []
    hospital_nodes = find_nearest_nodes(humon_road, hospital_Pnt) if len(hospital_gdf) > 0 else []
        
    
    if len(metro_gdf) > 0:
        metro_Pnt =[(metro_gdf.iloc[i]['geometry'].centroid.x, metro_gdf.iloc[i]['geometry'].centroid.y) for i in range(len(metro_gdf))]
        metro_nodes = find_nearest_nodes(humon_road, metro_Pnt)
        nearest_metro_dict = find_nearest_build_for_houses(house_nodes, metro_nodes)
        for i in (nearest_metro_dict.keys()):
            for j in (nearest_metro_dict[i]):
                try:
                    paths.append(nx.shortest_path(G, j, i))
                except:
                    continue
    
    
    if len(school_gdf) > 0:
        school_Pnt = [(school_gdf.iloc[i]['geometry'].centroid.x, school_gdf.iloc[i]['geometry'].centroid.y) for i in range(len(school_gdf))]
        school_nodes = find_nearest_nodes(humon_road, school_Pnt)
        nearest_schools_dict = find_nearest_build_for_houses(house_nodes, school_nodes)
        for i in (nearest_schools_dict.keys()):
            for j in (nearest_schools_dict[i]):
                try:
                    paths.append(nx.shortest_path(G, j, i))
                except:
                    continue
    
    
    if len(sadik_gdf) > 0:     
        sadik_Pnt = [(sadik_gdf.iloc[i]['geometry'].centroid.x, sadik_gdf.iloc[i]['geometry'].centroid.y) for i in range(len(sadik_gdf))]
        sadik_nodes = find_nearest_nodes(humon_road, sadik_Pnt)
        nearest_sadik_dict = find_nearest_build_for_houses(house_nodes, sadik_nodes)     
        for i in (nearest_sadik_dict.keys()):
            for j in (nearest_sadik_dict[i]):
                try:
                    paths.append(nx.shortest_path(G, j, i))
                except:
                    continue
    
    
    if len(hospital_gdf) > 0:
        hospital_Pnt = [(hospital_gdf.iloc[i]['geometry'].centroid.x, hospital_gdf.iloc[i]['geometry'].centroid.y) for i in range(len(hospital_gdf))]
        hospital_nodes = find_nearest_nodes(humon_road, hospital_Pnt)
        nearest_hospital_dict = find_nearest_build_for_houses(house_nodes, hospital_nodes)
        for i in (nearest_hospital_dict.keys()):
            for j in (nearest_hospital_dict[i]):
                try:
                    paths.append(nx.shortest_path(G, j, i))
                except:
                    continue
    G = nx.Graph()
    G_pesh = nx.Graph()
    

    
    for geom in humon_road.geometry:
        if isinstance(geom, LineString):
            add_edge_to_graph(geom, G)
        elif geom.geom_type == 'MultiLineString':
            for part in geom:
                add_edge_to_graph(part, G)
    
    for geom in pesh_road.geometry:
        if isinstance(geom, LineString):
            add_edge_to_graph(geom, G_pesh)
        elif geom.geom_type == 'MultiLineString':
            for part in geom:
                add_edge_to_graph(part, G_pesh)
    
    for pat in (paths):
        cnt = HumonCnt[house_nodes.index(pat[0])]
        for i in range(len(pat) - 1):
            u, v = pat[i], pat[i + 1]
            if G.has_edge(u, v) and not(G_pesh.has_edge(u, v)):
                if pat[len(pat)-1] in metro_nodes:
                    G[u][v]["usage"] += (cnt * 0.45)/4/8000
                if pat[len(pat)-1] in school_nodes or pat[len(pat)-1] in sadik_nodes:
                    G[u][v]["usage"] += (cnt * 0.20 * 1.3)/4/8000
                if pat[len(pat)-1] in hospital_nodes:
                    G[u][v]["usage"] += (cnt * 0.05)/4/8000
            if G_pesh.has_edge(u, v):
                if pat[len(pat)-1] in metro_nodes:
                    G[u][v]["usage"] += (cnt * 0.45) /4/800
                if pat[len(pat)-1] in school_nodes or pat[len(pat)-1] in sadik_nodes:
                    G[u][v]["usage"] += (cnt * 0.20 * 1.3)/4/800
                if pat[len(pat)-1] in hospital_nodes:
                    G[u][v]["usage"] += (cnt * 0.05)/4/800
    transformer = Transformer.from_crs("EPSG:3857", "EPSG:4326", always_xy=True)
    JsonSaver = {
        'type': "FeatureCollection",
        'features': []
    }

    for u, v, data in G.edges(data=True):
        point_coords = transformer.transform(u[0], u[1])
        transformed_coords1 = [point_coords[1], point_coords[0]]
        point_coords1 = transformer.transform(v[0], v[1])
        transformed_coords2 = [point_coords1[1], point_coords1[0]]
        usage = data.get("usage", 0)

        # Применяем цветовую шкалу в зависимости от уровня нагрузки
        color = [min(1.0, 0 + (usage / 100)), max(0.0, 1 - (usage / 100)), 0]  # Пример шкалы

        feature = {
            'type': 'Feature',
            'properties': {
                'id': 1,
                'stage': stage,
                'name': f'Улица {u}-{v}'
            },
            'geometry': {
                'type': "LineString",
                'coordinates': [transformed_coords1, transformed_coords2],
                'color': color
            }
        }

        JsonSaver['features'].append(feature)

    return JsonSaver            

def get_problem_zones(bounds: List[float], stage: str):
    pass

def get_optimal_route(targetA: list, targetB: list):
    pass

def get_stage_changes(bounds: List[float], stage: str):
    pass

def createGraph(humon_road):
    G = nx.Graph()
    for idx, row in humon_road.iterrows():
        geometry = row['geometry']
        if isinstance(geometry, LineString) and row['Foot'] == 1:
            coords = list(geometry.coords)
            for i in range(len(coords) - 1):
                start = coords[i]
                end = coords[i + 1]
                if row['RoadDirect'] == 'F':
                    G.add_edge(start, end, weight='weight')
                elif row['RoadDirect'] == 'T':
                    G.add_edge(end, start, weight='weight')
                elif row['RoadDirect'] == 'Any':
                    G.add_edge(start, end, weight='weight')
                    G.add_edge(end, start, weight='weight')
    return G           