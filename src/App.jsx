import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProfilePage from './components/Profile/ProfilePage/ProfilePage';
import PersonalData from './components/Profile/PersonalData/PersonalData';
import Notifications from './components/Profile/Notifications/Notifications';
import SettingsPanel from './components/Profile/SettingsPanel/SettingsPanel';
import Home from './components/Profile/Home/Home';
import News from './components/Profile/News/News'; 
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Головний маршрут профілю з вкладеними вкладками */}
        <Route path="/profile" element={<ProfilePage />}>
          <Route index element={<Navigate to="personal-data" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="personal-data" element={<PersonalData />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settingspanel" element={<SettingsPanel />} />
          {/* Додано маршрут для новин */}
          <Route path="news" element={<News />} />
          
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