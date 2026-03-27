import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';

// Імпорти компонентів
import ProfilePage from './components/Profile/ProfilePage/ProfilePage';
import PersonalData from './components/Profile/PersonalData/PersonalData';
import Notifications from './components/Profile/Notifications/Notifications';
import SettingsPanel from './components/Profile/SettingsPanel/SettingsPanel';
import Home from './components/Profile/Home/Home';
import News from './components/Profile/News/News';

// ============================================
// КОНФІГУРАЦІЯ МАРШРУТІВ
// ============================================

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/profile" replace />,
  },
  {
    path: '/profile',
    element: <ProfilePage />, // Батьківський компонент з <Outlet />
    children: [
      // Home — головний маршрут (відображається на /profile)
      {
        index: true,
        element: <Home />,
      },
      // Інші маршрути профілю
      {
        path: 'personal-data',
        element: <PersonalData />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'settingspanel',
        element: <SettingsPanel />,
      },
      {
        path: 'news',
        element: <News />,
      },
      // Обробка невідомих шляхів
      {
        path: '*',
        element: <Navigate to="/profile" replace />,
      },
    ],
    errorElement: <ProfileErrorBoundary />,
  },
]);

// ============================================
// Компонент обробки помилок
// ============================================

function ProfileErrorBoundary({ error }) {
  return (
    <div role="alert" className="error-boundary">
      <h2>Щось пішло не так</h2>
      <p>Не вдалося завантажити розділ профілю.</p>
      {process.env.NODE_ENV === 'development' && (
        <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
          {error?.message || 'Unknown error'}
        </pre>
      )}
      <button onClick={() => window.location.reload()} className="retry-btn">
        Оновити сторінку
      </button>
    </div>
  );
}

// ============================================
// Головний компонент додатку
// ============================================
function App() {
  return <RouterProvider router={router} />;
}

export default App;