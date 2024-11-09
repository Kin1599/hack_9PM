
import { useState, useCallback } from "react";

export const useGeoData = (fetchHouseData, fetchMetroData, fetchStreetData, fetchBusData) => {
    const [geoData, setGeoData] = useState({
        houses: [],
        streets: [],
        metroExits: [],
        busStations: []
    });

    const loadData = useCallback(async (bounds, stage) => {
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
    }, [fetchStreetData, fetchBusData, fetchHouseData, fetchMetroData]);

    return { geoData, loadData };
};