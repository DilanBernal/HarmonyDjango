import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function Home(){
  const { t } = useTranslation();
  const navigate = useNavigate();

  const logout = () =>{
    localStorage.removeItem('hs_access');
    localStorage.removeItem('hs_refresh');
    navigate('/login');
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1>{t('home.title')}</h1>
        <button className="btn btn-outline-secondary" onClick={logout}>{t('home.logout')}</button>
      </div>
      <p className="lead mt-3">{t('home.welcome')}</p>
    </div>
  );
}
