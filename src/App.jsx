import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProfilePage from './components/ProfilePage/ProfilePage';
import PersonalData from './components/PersonalData/PersonalData';
import Notifications from './components/Notifications/Notifications';
import SettingsPanel from './components/SettingsPanel/SettingsPanel';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Головний маршрут профілю з вкладеними вкладками */}
        <Route path="/profile" element={<ProfilePage />}>
          <Route index element={<Navigate to="personal-data" replace />} />
          <Route path="personal-data" element={<PersonalData />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settingspanel" element={<SettingsPanel />} />
          {/* Додайте інші вкладки за потреби: security, privacy, help */}
          
          {/* 404 для невідомих вкладок */}
          <Route path="*" element={<Navigate to="personal-data" replace />} />
        </Route>

        {/* Редирект з кореня на профіль */}
        <Route path="/" element={<Navigate to="/profile" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;