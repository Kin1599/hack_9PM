import MockData from "../data/data";

export default class MockServer{
    //* Здесь можно писать фальшивые функции

    //* Функция для получения данных об улицах
    static async getStreetData(){
      return MockData.streetData;
    }
    
    //* Функция для получения данных о домах
    static async getHousesData(bounds, stage) { 
      return MockData.houseData;
    };
      
    //* Функция для получения данных о станциях метро
    static async getMetroStationsData(bounds){
      return MockData.subwayExits;
    }

    //* Функция для получения данных об автобусных остановках
    static async getBusStationsData(bounds){
      return MockData.busStations;
    }

    //* Функция для получения изменений карты
    static async getChangeMap(stage){
        
    }
}

