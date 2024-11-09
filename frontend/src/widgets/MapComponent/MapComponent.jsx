import React, { useEffect, useRef, useState } from 'react';
import cl from './MapComponent.module.scss';
import { YMaps, Map, Placemark, GeoObject } from '@pbe/react-yandex-maps';
import danger from '../../shared/assets/danger.svg'
import layer from '../../shared/assets/layer.svg'

function MapComponent({ fetchHouseData, fetchMetroData, fetchStreetData }) {
  const mapContainerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [houses, setHouses] = useState([]);
  const [streets, setStreets] = useState([]);
  const [metroStations, setMetroStations] = useState([]);
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
      console.log(bounds);
      
      if (bounds) {
        if(bounds){
          const houseData = await fetchHouseData(bounds, currentStage);
          const streetsData = await fetchStreetData(bounds, currentStage);
          const metroData = await fetchMetroData(bounds, currentStage);

          setHouses(houseData);
          setMetroStations(metroData);
          setStreets(streetsData);
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
        console.log(bounds);
        const housesData = await fetchHouseData(bounds, stage);
        const streetsData = await fetchStreetData(bounds, stage);
        const metroData = await fetchMetroData(bounds, stage);

        setHouses(housesData);
        setStreets(streetsData);
        setMetroStations(metroData);
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
            defaultState={{ center: [55.095276, 38.765574], zoom: 13 }}
            width="100%"
            height="100dvh"
            instanceRef={map => setMapInstance(map)}
            onBoundsChange={handleBoundsChange}
          >
            { houses.map((house, index) => ( 
              <GeoObject 
                key={index} 
                geometry={{ type: 'Polygon', coordinates: house.coordinates }} 
                properties={{ balloonContent: house.name }} 
                options={{ strokeColor: "#ff0000", strokeWidth: 2, fillColor: "#ffcccc" }} 
              /> 
            ))}
            { streets.map((street, index) => ( 
              <GeoObject 
                key={index} 
                geometry={{ type: 'LineString', coordinates: street.coordinates }} 
                properties={{ balloonContent: street.name }} 
                options={{ strokeColor: "#0000ff", strokeWidth: 4 }} 
              /> 
            ))}
            {metroStations.map((station, index) => ( 
              <Placemark 
                key={index} 
                geometry={station.coordinates} 
                properties={{ balloonContent: station.name }} 
                options={{ iconColor: "#00ff00" }} 
              /> 
            ))}
          </Map>
        </YMaps>
      )}
    </div>
  );
}

export default MapComponent;
