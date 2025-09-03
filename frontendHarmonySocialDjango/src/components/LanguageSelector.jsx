import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector(){
  const { i18n } = useTranslation();

  const containerStyle = {
    position: 'fixed',
    top: 12,
    left: 12,
    zIndex: 9999,
    background: 'rgba(106, 106, 106, 0.95)',
    padding: '6px 8px',
    borderRadius: 6,
    boxShadow: '0 2px 2px 2px rgba(0,0,0,0.15)'
  };

  const selectStyle = {
    border: 'none',
    background: 'black',
    fontWeight: '600'
  };

  return (
    <div style={containerStyle} aria-hidden={false}>
      <select
        aria-label="Select language"
        style={selectStyle}
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
        <option value="fr">FR</option>
      </select>
    </div>
  );
}
