import MockData from "../data/data";

export default class MockServer{
    //* Здесь можно писать фальшивые функции

    //* Функция для получения данных об улицах
    static async getStreetData(bounds, stage){
      if (stage === "stage1"){
        return MockData.streetDataStage1;
      } else if (stage === "stage2") {
        return MockData.streetDataStage2;
      } else if (stage === "stage3"){
        return MockData.streetDataStage3;
      }      
    }
    
    //* Функция для получения данных о домах
    static async getHousesData(bounds, stage) { 
      if (stage === "stage1"){
        return MockData.houseDataStage1;
      } else if (stage === "stage2"){
        return MockData.houseDataStage2;
      } else if (stage === "stage3") {
        return MockData.houseDataStage3;
      }
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

    //* Функция для отправки фото и описания для дальнейшего анализа
    static async postAnalyzePhoto(formData){
      return {
        "result": "1. **Улучшение пешеходных переходов**: Создание новых пешеходных переходов или реконструкция существующих может помочь уменьшить нагрузку на самые переполненные участки.\n"+
        "2. **Создание новых пешеходных маршрутов**: Создание новых пешеходных маршрутов может помочь уменьшить нагрузку на самые переполненные участки.\n"+
        "3. **Увеличение доступности общественных зон**: Создание новых общественных зон или увеличение доступности существующих может помочь уменьшить нагрузку на самые переполненные участки.\n"+
        "4. **Улучшение инфраструктуры**: Улучшение инфраструктуры, включая дороги, общественные зоны и транспортные системы, может помочь уменьшить нагрузку на самые переполненные участки.\n"+        
        "5. **Улучшение пешеходной инфраструктуры**: Улучшение пешеходной инфраструктуры, включая создание новых пешеходных переходов, увеличение количества светофоров или создание новых пешеходных путей, может помочь уменьшить нагрузку на самые переполненные.\n "
      }
  }
}

