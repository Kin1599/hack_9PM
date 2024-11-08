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
    static async getStreetData(){
        return await axios.get(baseUrl + '/streets')
            .then(response => response.data)
            .catch(error => console.log('Error fetching streets', error));
    }

    //* Функция для получения данных о домах
    static async getHousesData(){
        return await axios.get(baseUrl + '/houses')
            .then(response => response.data)
            .catch(error => console.log('Error fetching houses', error));
    }

    //* Функция для получения данных карты
    static async getMap(){
        return await axios.get(baseUrl + '/map')
            .then(response => response.data)
            .catch(error => console.log('Error fetching map', error));
    }
}

