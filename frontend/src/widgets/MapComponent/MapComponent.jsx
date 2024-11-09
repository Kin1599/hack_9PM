import React, { useEffect, useRef, useState } from 'react';
import cl from './MapComponent.module.scss';
import { YMaps, Map, GeoObject } from '@pbe/react-yandex-maps';
import danger from '../../shared/assets/danger.svg'
import layer from '../../shared/assets/layer.svg'

function MapComponent({ fetchHouseData, fetchMetroData, fetchStreetData, fetchBusData }) {
  const mapContainerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [houses, setHouses] = useState([]);
  const [streets, setStreets] = useState([]);
  const [metroExits, setMetroExits] = useState([]);
  const [busStations, setBusStations] = useState([]);
  const [currentStage, setCurrentStage] = useState('stage1');
  const [isProblem, setIsProblem] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const apiKey = process.env.REACT_APP_YMAPS_API_KEY;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(mapContainerRef.current);
        }
      });
    }, { threshold: 0.25 });

    observer.observe(mapContainerRef.current);

    return () => observer.disconnect();
  }, []);

  const handleBoundsChange = async () => {
    if (mapInstance){
      const bounds = mapInstance.getBounds();
      
      if (bounds) {
        if(bounds){
          const houseData = await fetchHouseData(bounds, currentStage);
          const streetsData = await fetchStreetData(bounds, currentStage);
          const metroData = await fetchMetroData(bounds);
          const busData = await fetchBusData(bounds);

          console.log(metroData);
          setHouses(houseData.features);
          setMetroExits(metroData.features);
          setStreets(streetsData.features);
          setBusStations(busData.features);
        }
      }
    }
  };

  const handleStageChange = async (stage) => {
    setCurrentStage(stage);
    setDropdownOpen(false);

    if (mapInstance){
      const bounds = mapInstance.getBounds();

      if (bounds) {
        const housesData = await fetchHouseData(bounds, stage);
        const streetsData = await fetchStreetData(bounds, stage);
        const metroData = await fetchMetroData(bounds, stage);
        const busData = await fetchBusData(bounds, stage);

        setHouses(housesData.features);
        setStreets(streetsData.features);
        setMetroExits(metroData.features);
        setBusStations(busData.features);
      }
    }
  };

  return (
    <div className={cl.map} ref={mapContainerRef}>
      <div className={cl.map__controls}>
        <button className={cl.controls__problem} onClick={e => setIsProblem(!isProblem) }>
          <img src={danger} alt="Показать проблемные зоны" className={`${cl.problem__img} ${isProblem ? cl.problem : ''}`}/>
        </button>
        <button className={cl.controls__stage} onClick={() => setDropdownOpen(!dropdownOpen)}>
          <img src={layer} alt="Выберите этап застройки" className={cl.stage__img}/>
        </button>
        {
          dropdownOpen && (
            <div className={cl.stage__dropdownMenu}>
              <button onClick={() => handleStageChange('stage1')} className={cl.dropdownMenu__item}>Этап 1</button>
              <button onClick={() => handleStageChange('stage2')} className={cl.dropdownMenu__item}>Этап 2</button>
              <button onClick={() => handleStageChange('stage3')} className={cl.dropdownMenu__item}>Этап 3</button>
            </div>
          )
        }
      </div>
      {isVisible && (
        <YMaps query={{ apikey: apiKey }}>
          <Map
            defaultState={{ center: [55.570395, 37.475495], zoom: 15 }}
            width="100%"
            height="100dvh"
            instanceRef={map => setMapInstance(map)}
            onBoundsChange={handleBoundsChange}
          >
           { houses && houses.map((house, index) => ( 
              <GeoObject 
                key={index} 
                geometry={{ type: house.geometry.type, coordinates: house.geometry.coordinates }} 
                properties={{ balloonContent: house.properties.name }} 
                options={{ geodesic: true, strokeColor: "#F008", strokeWidth: 5, fillColor: "#F00833" }} 
              /> 
            ))}
            { streets && streets.map((street, index) => ( 
              <GeoObject 
                key={index} 
                geometry={{ type: street.geometry.type, coordinates: street.geometry.coordinates }} 
                properties={{ balloonContent: street.properties.name }} 
                options={{ strokeColor: "#0000ff", strokeWidth: 4 }} 
              /> 
            ))}
            { metroExits && metroExits.map((metroExit, index) => ( 
              <GeoObject
                key={index} 
                geometry={{type: metroExit.geometry.type, coordinates: metroExit.geometry.coordinates}} 
                properties={{ 
                  balloonContent: metroExit.properties.name,
                  iconContent: metroExit.properties.id,
                }} 
                options={{ geodesic: true, iconColor: "#00ff00" }} 
              /> 
            ))}
            { busStations && busStations.map((busStation, index) => ( 
              <GeoObject
                key={index} 
                geometry={{type: busStation.geometry.type, coordinates: busStation.geometry.coordinates}} 
                properties={{ 
                  balloonContent: busStation.properties.name,
                }} 
                options={{ geodesic: true, iconColor: "#3b83ff" }} 
              /> 
            ))}
          </Map>
        </YMaps>
      )}
    </div>
  );
}

export default MapComponent;
