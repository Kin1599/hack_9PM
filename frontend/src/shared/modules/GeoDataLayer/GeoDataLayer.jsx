import React from 'react'
import { GeoObject } from '@pbe/react-yandex-maps';

function GeoDataLayer({ geoData }) {

    // Определение цветов в зависимости от типа здания
    const getBuildingOptions = (type) => {
        switch(type) {
        case 'Административные сооружения':
            return { strokeColor: '#808080', fillColor: '#80808033', strokeWidth: 5 }; 
        case 'Жилые дома':
            return { strokeColor: '#4682B4', fillColor: '#4682B433', strokeWidth: 5 };    
        case 'Частные дома':
            return { strokeColor: '#8B4513', fillColor: '#8B451333', strokeWidth: 5 }; 
        case 'Дома_новостройки':
            return { strokeColor: '#2E8B57', fillColor: '#2E8B5733', strokeWidth: 5 };
        case 'Школы':
            return { strokeColor: '#FFD700', fillColor: '#FFD70033', strokeWidth: 5 };
        case 'Дошкольные':
            return { strokeColor: '#FF8C00', fillColor: '#FF8C0033', strokeWidth: 5 };
        case 'Киоски':
            return { strokeColor: '#FF4500', fillColor: '#FF450033', strokeWidth: 5 };
        case 'Известный по назначению':
            return { strokeColor: '#6A5ACD', fillColor: '#6A5ACD33', strokeWidth: 5 };
        case 'Подземное здание':
            return { strokeColor: '#708090', fillColor: '#70809033', strokeWidth: 5 };
        default:
            return { strokeColor: '#808080', fillColor: '#80808033', strokeWidth: 5 }; 
        }
    };

    const renderGeoObjects = (data, options, indexPrefix, addNumbers = false) => 
        data.map((item, index) => (
            <GeoObject
                key={`${indexPrefix}-${index}`}
                geometry={{
                    type: item.geometry.type,
                    coordinates: indexPrefix === 'street' ? item.geometry.coordinates[0] : item.geometry.coordinates
                }}
                properties={{
                    iconContent: addNumbers ? item.properties.id : '',
                    ballonContent: item.properties.name,
                }}
                options={indexPrefix === 'house' ? getBuildingOptions(item.properties.type) : options}
            />
        ))

  return (
    <>
        {renderGeoObjects(geoData.houses, { strokeColor: '#808080', strokeWidth: 5, fillColor: '#80808033' }, 'house')}
        {renderGeoObjects(geoData.streets, { strokeColor: '#9150b3', strokeWidth: 4 }, 'street')}
        {renderGeoObjects(geoData.metroExits, { iconColor: '#00ff00' }, 'metro', true)}
        {renderGeoObjects(geoData.busStations, { iconColor: '#3b83ff' }, 'bus')}
    </>
  )
}

export default GeoDataLayer