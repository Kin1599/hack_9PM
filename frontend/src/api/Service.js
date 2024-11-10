import axios from "axios"
import baseUrl from "../config";

export default class SendServer{
    //* Здесь можно писать функции, которые взаимодействуют с сервером

    //* Функция для проверки на CORS
    static async getPing(){
        return await axios.get(baseUrl + '/ping')
            .then(response => response.data)
            .catch(error => console.log('Error fetching products', error));
    }

    //* Функция для получения данных об улицах
    static async getStreetData(bounds, stage){
        const boundsString = bounds.join(',');
        return await axios.get(`${baseUrl}/streets?bounds=${boundsString}&stage=${stage}`)
            .then(response => response.data)
            .catch(error => console.log('Error fetching streets', error));
    }

    //* Функция для получения данных о домах
    static async getHousesData(bounds, stage){
        const boundsString = bounds.join(',');
        return await axios.get(`${baseUrl}/houses?bounds=${boundsString}&stage=${stage}`)
            .then(response => response.data)
            .catch(error => console.log('Error fetching houses', error));
    }

    //* Функция для получения данных о станциях метро
    static async getMetroStationsData(bounds){
        const boundsString = bounds.join(',');
        return await axios.get(`${baseUrl}/metro_exits?bounds=${boundsString}`)
            .then(response => response.data)
            .catch(error => console.log('Error fetching metro exits', error));
    }
  
    //* Функция для получения данных об автобусных остановках
    static async getBusStationsData(bounds){
        const boundsString = bounds.join(',');
        return await axios.get(`${baseUrl}/bus_stops?bounds=${boundsString}`)
            .then(response => response.data)
            .catch(error => console.log('Error fetching bus stops', error));
    }

    //* Функция для получения данных карты
    static async getMap(){
        return await axios.get(baseUrl + '/map')
            .then(response => response.data)
            .catch(error => console.log('Error fetching map', error));
    }


    //* Функция для отправки фото и описания для дальнейшего анализа
    static async postAnalyzePhoto(formData){
        return await axios.post(baseUrl + '/analyze_image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => response.data)
            .catch(error => console.log('Error fetching analyze', error));
    }
}

