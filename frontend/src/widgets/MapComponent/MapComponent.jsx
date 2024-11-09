import React, { useEffect, useRef, useState } from 'react';
import cl from './MapComponent.module.scss';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

function MapComponent({ fetchData }) {
  const mapContainerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [markers, setMarkers] = useState([]);
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

  const handleBoundsChange = (e) => {
    const bounds = e.get('newBounds');
    if (bounds) {
      const [[swLat, swLng], [neLat, neLng]] = bounds;
      fetchData({ swLat, swLng, neLat, neLng }).then((data) => {
        setMarkers(data);
      });
    }
  };

  return (
    <div className={cl.map} ref={mapContainerRef}>
      {isVisible && (
        <YMaps query={{ apikey: apiKey }}>
          <Map
            defaultState={{ center: [55.75, 37.57], zoom: 9 }}
            width="100%"
            height="100dvh"
            onBoundsChange={handleBoundsChange}
          >
            {markers.map((marker, index) => (
              <Placemark key={index} geometry={marker.coordinates} properties={marker.properties} />
            ))}
          </Map>
        </YMaps>
      )}
    </div>
  );
}

export default MapComponent;
