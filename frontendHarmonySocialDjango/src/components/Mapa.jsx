import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Mapa simple que permite seleccionar una coordenada con un click.
// Props:
// - coordenadas: { lat, lng } | null
// - onCoordenadasChange: function({ lat, lng })
export default function Mapa({ coordenadas, onCoordenadasChange }){
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  // keep a stable ref to the callback so we don't have to re-init the map when
  // the parent passes a new function reference on each render
  const handlerRef = useRef(onCoordenadasChange);

  // update the handler ref whenever prop changes
  useEffect(() => {
    handlerRef.current = onCoordenadasChange;
  }, [onCoordenadasChange]);

  useEffect(() => {
    // initialize map only once
    if (mapRef.current) return;
    if (!containerRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center: [0,0],
      zoom: 2,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapRef.current);

    // click handler uses handlerRef to avoid recreating the handler
    mapRef.current.on('click', function(e){
      const { lat, lng } = e.latlng;
      if(markerRef.current){
        markerRef.current.setLatLng(e.latlng);
      } else {
        markerRef.current = L.marker(e.latlng).addTo(mapRef.current);
      }
      if(handlerRef.current) handlerRef.current({ lat, lng });
    });

    return () => {
      if(mapRef.current){
        mapRef.current.off();
        mapRef.current.remove();
      }
      mapRef.current = null;
    };
  }, []);

  // if coordenadas change from outside, move the marker (no re-init)
  useEffect(() => {
    if(!mapRef.current) return;
    if(coordenadas && coordenadas.lat != null && coordenadas.lng != null){
      const latlng = [coordenadas.lat, coordenadas.lng];
      mapRef.current.setView(latlng, 12);
      if(markerRef.current) markerRef.current.setLatLng(latlng);
      else markerRef.current = L.marker(latlng).addTo(mapRef.current);
    }
  }, [coordenadas]);

  return (
    <div style={{ width: '100%', height: '300px' }} ref={containerRef} />
  );
}
