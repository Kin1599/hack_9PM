import React, { useEffect, useRef, useState } from 'react';
import cl from './MapComponent.module.scss';
import { useGeoData } from '../../hooks/useGeoData';
import magic from '../../shared/assets/magic.svg'

import { YMaps, Map } from '@pbe/react-yandex-maps';
import GeoDataLayer from '../../shared/modules/GeoDataLayer/GeoDataLayer';
import MapControls from '../../shared/modules/MapControls/MapControls';
import ChatWindow from '../ChatWindow/ChatWindow';

function MapComponent({ fetchHouseData, fetchMetroData, fetchStreetData, fetchBusData, fetchAnalyze }) {
  const mapContainerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { geoData, loadData } = useGeoData(fetchHouseData, fetchMetroData, fetchStreetData, fetchBusData);
  const [currentStage, setCurrentStage] = useState('stage1');
  const [isSuggestion, setIsSuggestion] = useState(false);
  const apiKey = process.env.REACT_APP_YMAPS_API_KEY;

  const [debounceTimer, setDebounceTimer] = useState(null);

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
      const zoom = mapInstance.getZoom();
      if (bounds) {
        if(!debounceTimer){
          console.log(bounds);
          console.log("Запрос отправлен");
        }

        if (debounceTimer){
          clearTimeout(debounceTimer);
        }

        const newDebounceTimer = setTimeout(async () => {
          await loadData(bounds, currentStage, zoom);
        }, 500);
        setDebounceTimer(newDebounceTimer);
      }
    }
  };

  const handleStageChange = async (stage) => {
    setCurrentStage(stage);

    if (mapInstance){
      const bounds = mapInstance.getBounds();
      const zoom = mapInstance.getZoom();
      if (bounds) {

        if(debounceTimer){
          clearTimeout(debounceTimer);
        }

        await loadData(bounds, stage, zoom);
      }
    }
  };

  const toggleState = (setter, value) => setter(!value);

  return (
    <div className={cl.map} ref={mapContainerRef}>
      <MapControls handleStageChange={handleStageChange}/>
      <div className={`${cl.map__controls} ${cl.map__aiControls}`}>
        <button className={cl.controls__button} onClick={() => toggleState(setIsSuggestion, isSuggestion)}>
          <img src={magic} alt="Предложения что можно изменить с помощью фото" className={cl.button__img}/>
        </button>
      </div>
      <div className={cl.map__chat}>
        {isSuggestion && <ChatWindow onClose={() => setIsSuggestion(false)} onSubmit={fetchAnalyze}/>}
      </div>
      {isVisible && (
        <YMaps query={{ apikey: apiKey }}>
          <Map
            defaultState={{ center: [55.55357355512132, 37.49579152990711], zoom: 16 }}
            width="100%"
            height="100dvh"
            instanceRef={map => setMapInstance(map)}
            onBoundsChange={handleBoundsChange}
          >
            <GeoDataLayer geoData={geoData}/>
          </Map>
        </YMaps>
      )}
    </div>
  );
}

export default MapComponent;
