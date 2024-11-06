import axios from "axios"

export default class SendServer{
    //* Здесь можно писать функции, которые взаимодействуют с сервером

    //* Функция для проверки на CORS
    static async getPing(){
        return await axios.get('http://127.0.0.1:8000/ping')
            .then(response => response.data)
            .catch(error => console.log('Error fetching products', error));
    }
}

