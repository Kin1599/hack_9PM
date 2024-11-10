import geopandas as gpd
from shapely.geometry import Polygon, MultiPolygon, LineString, Point
from pyproj import Transformer

# Инициализация трансформера для конвертации координат из EPSG:3857 в EPSG:4326 (широта/долгота)
transformer = Transformer.from_crs("EPSG:3857", "EPSG:4326", always_xy=True)

def transform_coordinates(coords):
    """Преобразует координаты в формат WGS84 (EPSG:4326)"""
    return [[lat, lon] for lon, lat in [transformer.transform(x, y) for x, y in coords]]

def create_geometry(geom):
    """Создает геометрию в формате GeoJSON в зависимости от типа объекта."""
    if isinstance(geom, Polygon):
        exterior_coords = list(geom.exterior.coords)
        return {
            "type": "Polygon",
            "coordinates": [transform_coordinates(exterior_coords)]
        }

    elif isinstance(geom, LineString):
        line_coords = list(geom.coords)
        return {
            "type": "LineString",
            "coordinates": [transform_coordinates(line_coords)]
        }
    
    elif isinstance(geom, Point):
        point_coords = transformer.transform(geom.x, geom.y)
        return {
            "type": "Point",
            "coordinates": [point_coords[1], point_coords[0]]
        }
    return None

def create_feature(geometry, properties):
    """Создает объект Feature с заданной геометрией и свойствами"""
    return {
        "type": "Feature",
        "properties": properties,
        "geometry": geometry
    }

def convert_to_geojson(gdf):
    """Принимает GeoDataFrame и возвращает объекты в формате GeoJSON."""
    features = []

    for i, row in gdf.iterrows():
        if row['geometry']:
            geom = row['geometry']

            if isinstance(geom, MultiPolygon):
                for j, polygon in enumerate(geom.geoms):
                    geometry = create_geometry(polygon)
                    if geometry:
                        properties = {
                            "id": f"{row.get('id', i)}_{j}",
                            "name": row.get("name", "Unnamed")
                        }
                        features.append(create_feature(geometry, properties))
            else:
                geometry = create_geometry(geom)
                if geometry:
                    properties = {
                        "id": row.get("id", i),
                        "name": row.get("name", "Unnamed")
                    }
                    features.append(create_feature(geometry, properties))
    return {
        "type": "FeatureCollection",
        "features": features
    }

def filter_by_bounds(features, bounds):
    """
    Фильтрует объекты в GeoJSON по заданным границам (min_lon, min_lat, max_lon, max_lat).
    """
    min_lon, min_lat, max_lon, max_lat = bounds
    filtered_features = []

    for feature in features:
        geometry = feature['geometry']
        geom_type = geometry['type']
        coordinates = geometry['coordinates']

        if geom_type == 'Polygon':
            # Для Polygon
            for polygon in coordinates:
                for lon, lat in polygon:
                    if min_lon <= lon <= max_lon and min_lat <= lat <= max_lat:
                        filtered_features.append(feature)
                        break

        elif geom_type == 'MultiPolygon':
            # Для MultiPolygon
            for multi_polygon in coordinates:
                for polygon in multi_polygon:
                    for lon, lat in polygon:
                        if min_lon <= lon <= max_lon and min_lat <= lat <= max_lat:
                            filtered_features.append(feature)
                            break

        elif geom_type == 'Point':
            # Для Point проверяем одиночные координаты
            lon, lat = coordinates
            if min_lon <= lon <= max_lon and min_lat <= lat <= max_lat:
                filtered_features.append(feature)

        elif geom_type == 'LineString':
            if isinstance(coordinates[0], list): 
                for line in coordinates:
                    for lon, lat in line:
                        if min_lon <= lon <= max_lon and min_lat <= lat <= max_lat:
                            filtered_features.append(feature)
                            break  
            else:
                for lon, lat in coordinates:
                    if min_lon <= lon <= max_lon and min_lat <= lat <= max_lat:
                        filtered_features.append(feature)
                        break  



        elif geom_type == 'MultiLineString':
            # Для MultiLineString проверяем первую точку каждой линии
            for line in coordinates:
                lon, lat = line[0] 
                if min_lon <= lon <= max_lon and min_lat <= lat <= max_lat:
                    filtered_features.append(feature)
                    break

    return filtered_features

