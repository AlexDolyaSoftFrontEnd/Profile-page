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
import Home from './components/Profile/Home/Home';
import News from './components/Profile/News/News';

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
// КОНФІГУРАЦІЯ МАРШРУТІВ
// ============================================

const router = createBrowserRouter([
  // Головна сторінка — редирект на профіль
  {
    path: '/',
    element: <Navigate to="/profile" replace />,
  },
  
  // Захищені маршрути профілю
  {
    path: '/profile',
    element: <ProfilePage />,
    errorElement: <ProfileErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'personal-data',
        element: <PersonalData />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'news',
        element: <News />,
      },
      {
        path: '*',
        element: <Navigate to="/profile" replace />,
      },
    ],
  },
  
  // 🚫 Глобальна обробка невідомих маршрутів
  {
    path: '*',
    element: <Navigate to="/profile" replace />,
  },
]);

// ============================================
// Головний компонент додатку
// ============================================

function App() {
  return <RouterProvider router={router} />;
}

export default App;