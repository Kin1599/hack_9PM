import React, { useCallback, useEffect, useRef, useState } from 'react';
import cl from './MapComponent.module.scss';
import { YMaps, Map, GeoObject } from '@pbe/react-yandex-maps';
import danger from '../../shared/assets/danger.svg'
import layer from '../../shared/assets/layer.svg'
import magic from '../../shared/assets/magic.svg'
import traffic from '../../shared/assets/traffic.svg'

function MapComponent({ fetchHouseData, fetchMetroData, fetchStreetData, fetchBusData }) {
  const mapContainerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [geoData, setGeoData] = useState({ houses: [], streets: [], metroExits: [], busStations: []})
  const [currentStage, setCurrentStage] = useState('stage1');
  const [isProblem, setIsProblem] = useState(false);
  const [isTraffic, setIsTraffic] = useState(false);
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

  // Функция загрузки данных
  const loadData = useCallback(
    async (bounds, stage) => {
      const [houseData, streetData, metroData, busData] = await Promise.all([
        fetchHouseData(bounds, stage),
        fetchStreetData(bounds, stage),
        fetchMetroData(bounds),
        fetchBusData(bounds),
      ]);

      setGeoData({
        houses: houseData.features || [],
        streets: streetData.features || [],
        metroExits: metroData.features || [],
        busStations: busData.features || [],
      });
    },
    [fetchHouseData, fetchStreetData, fetchMetroData, fetchBusData]
  );

  const handleBoundsChange = async () => {
    if (mapInstance){
      const bounds = mapInstance.getBounds();

      if (bounds) {
        if(bounds){
          await loadData(bounds, currentStage);
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
        await loadData(bounds, stage);
      }
    }
  };

  const toggleState = (setter, value) => setter(!value);

  //Функция для рендера GeoObject
  const renderGeoObjects = (data, options, indexPrefix = '') =>
    data.map((item, index) => (
      <GeoObject
        key={`${indexPrefix}-${index}`}
        geometry={{type: item.geometry.type, coordinates: item.geometry.coordinates}}
        properties={{balloonContent: item.properties.name}}
        options={options}
      />
    ))

  return (
    <div className={cl.map} ref={mapContainerRef}>
      <div className={`${cl.map__controls} ${cl.map__mainControls}`}>
        <button className={cl.controls__button} onClick={() => toggleState(setIsTraffic, isTraffic)}>
          <img src={traffic} alt="Показать нагруженность дорог" className={`${cl.button__img} ${isTraffic ? cl.traffic : ''}`}/>
        </button>
        <button className={cl.controls__button} onClick={() => toggleState(setIsProblem, isProblem)}>
          <img src={danger} alt="Показать проблемные зоны" className={`${cl.button__img} ${isProblem ? cl.problem : ''}`}/>
        </button>
        <button className={cl.controls__button} onClick={() => setDropdownOpen(!dropdownOpen)}>
          <img src={layer} alt="Выберите этап застройки" className={cl.button__img}/>
        </button>
        {
          dropdownOpen && (
            <div className={cl.stage__dropdownMenu}>
              {['stage1', 'stage2', 'stage3'].map((stage, index) => (
                <button key={index} onClick={() => handleStageChange(stage)} className={cl.dropdownMenu__item}>
                  Этап {index + 1}
                </button>
              ))}
            </div>
          )
        }
      </div>
      <div className={`${cl.map__controls} ${cl.map__aiControls}`}>
        <button className={cl.controls__button}>
          <img src={magic} alt="Предложения что можно изменить с помощью фото" className={cl.button__img}/>
        </button>
      </div>
      {isVisible && (
        <YMaps query={{ apikey: apiKey }}>
          <Map
            defaultState={{ center: [55.55357355512132, 37.49579152990711], zoom: 15 }}
            width="100%"
            height="100dvh"
            instanceRef={map => setMapInstance(map)}
            onBoundsChange={handleBoundsChange}
          >
            {renderGeoObjects(geoData.houses, { geodesic: true, strokeColor: "#F008", strokeWidth: 5, fillColor: "#F00833" }, 'house')}
            {renderGeoObjects(geoData.streets, { strokeColor: "#0000ff", strokeWidth: 4 }, 'street')}
            {renderGeoObjects(geoData.metroExits, { geodesic: true, iconColor: "#00ff00" }, 'metro')}
            {renderGeoObjects(geoData.busStations, { geodesic: true, iconColor: "#3b83ff" }, 'bus')}
          </Map>
        </YMaps>
      )}
    </div>
  );
}

export default MapComponent;
