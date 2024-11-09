import React from 'react'
import { GeoObject } from '@pbe/react-yandex-maps';

function GeoDataLayer({ geoData }) {

    const renderGeoObjects = (data, options, indexPrefix, addNumbers = false) => 
        data.map((item, index) => (
            <GeoObject
                key={`${indexPrefix}-${index}`}
                geometry={{
                    type: item.geometry.type,
                    coordinates: item.geometry.coordinates,
                }}
                properties={{
                    iconContent: addNumbers ? item.properties.id : '',
                    ballonContent: item.properties.name,
                }}
                options={options}
            />
        ))

  return (
    <>
        {renderGeoObjects(geoData.houses, { strokeColor: '#F008', strokeWidth: 5, fillColor: '#F00833' }, 'house')}
        {renderGeoObjects(geoData.streets, { strokeColor: '#0000ff', strokeWidth: 4 }, 'street')}
        {renderGeoObjects(geoData.metroExits, { iconColor: '#00ff00' }, 'metro', true)}
        {renderGeoObjects(geoData.busStations, { iconColor: '#3b83ff' }, 'bus')}
    </>
  )
}

export default GeoDataLayer