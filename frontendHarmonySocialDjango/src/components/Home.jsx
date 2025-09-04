import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Mapa from './Mapa';
import axios from 'axios';

export default function Home(){
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('hs_access');
    localStorage.removeItem('hs_refresh');
    navigate('/login');
  }

  // Configurar los headers para las solicitudes
  const getAxiosConfig = () => {
    const token = localStorage.getItem('hs_access');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  // Obtener la ubicación del usuario al cargar el componente
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, lng } = position.coords;
          const locationData = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(locationData);

          // Actualizar la ubicación en el backend
          updateLocationInBackend(locationData);

          // Buscar usuarios cercanos
          fetchNearbyUsers(locationData);
        },
        (error) => {
          console.error("Error obtaining location:", error);
          setError(t('home.locationError'));
          setLoading(false);
        }
      );
    } else {
      setError(t('home.browserLocationNotSupported'));
      setLoading(false);
    }
  }, []);

  // Actualizar la ubicación en el backend
  const updateLocationInBackend = async (location) => {
    try {
      await axios.post(
        'http://localhost:3000/api/update-location', 
        { lat: location.lat, lng: location.lng },
        getAxiosConfig()
      );
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  // Buscar usuarios cercanos
  const fetchNearbyUsers = async (location) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/nearby-users?lat=${location.lat}&lng=${location.lng}`,
        getAxiosConfig()
      );
      setNearbyUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching nearby users:', error);
      setError(t('home.fetchError'));
      setLoading(false);
    }
  };

  // Manejar cambio de ubicación desde el mapa
  const handleLocationChange = (newLocation) => {
    setUserLocation(newLocation);
    updateLocationInBackend(newLocation);
    fetchNearbyUsers(newLocation);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{t('home.title')}</h1>
        <button className="btn btn-outline-secondary" onClick={logout}>{t('home.logout')}</button>
      </div>
      
      <div className="row">
        <div className="col-md-12">
          <p className="lead">{t('home.welcome')}</p>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">{t('home.mapTitle')}</h5>
            </div>
            <div className="card-body">
              {error ? (
                <div className="alert alert-danger">{error}</div>
              ) : (
                <Mapa 
                  coordenadas={userLocation} 
                  onCoordenadasChange={handleLocationChange}
                />
              )}
            </div>
            <div className="card-footer bg-white">
              <small className="text-muted">
                {t('home.clickMapToUpdate')}
              </small>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">{t('home.nearbyUsers')}</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t('home.loading')}</span>
                  </div>
                </div>
              ) : nearbyUsers.length > 0 ? (
                <ul className="list-group">
                  {nearbyUsers.map(user => (
                    <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{user.username}</strong>
                        {user.is_artist && (
                          <span className="badge bg-warning ms-2">{t('home.artist')}</span>
                        )}
                        {user.favorite_instrument && (
                          <div><small className="text-muted">{user.favorite_instrument}</small></div>
                        )}
                      </div>
                      <span className="badge bg-primary rounded-pill">
                        {user.distance ? `${user.distance.toFixed(1)} km` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="alert alert-info">
                  {t('home.noNearbyUsers')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
