export default class MockServer{
    //* Здесь можно писать фальшивые функции

    //* Функция для получения данных об улицах
    static async getStreetData(){

    }
    
    //* Функция для получения данных о домах
    static async getHousesData(bounds, stage) { 
        const {swLat, swLng, neLat, neLng} = bounds;
        const response = await fetch(`/api/data?swLat=${swLat}&swLng=${swLng}&neLat=${neLat}&neLng=${neLng}`);
        const data = await response.json();
        return data.map(item => ({
          coordinates: [item.latitude, item.longitude],
          properties: { hintContent: item.name }
        }));
      };
      
    //* Функция для получения данных о станциях метро
    static async getMetroStationsData(bounds, stage){
      
    }

    //* Функция для получения данных об автобусных остановках
    static async getBusStationsData(bounds, stage){
      
    }

    //* Функция для получения изменений карты
    static async getChangeMap(stage){
        
    }
}

