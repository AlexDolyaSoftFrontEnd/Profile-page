import React from 'react';
import './Home.css';

const Home = () => {
  const teamMembers = [
    { id: 1, isOwner: true },
    { id: 2, isOwner: false },
    { id: 3, isOwner: false },
    { id: 4, isOwner: false },
    { id: 5, isOwner: false },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="header">
        <div className="avatar avatar-large">
          <svg viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#1a3a3a"/>
            <circle cx="15" cy="18" r="3" fill="#4ade80"/>
            <circle cx="25" cy="18" r="3" fill="#4ade80"/>
            <circle cx="20" cy="25" r="3" fill="#4ade80"/>
            <circle cx="15" cy="28" r="2" fill="#4ade80"/>
            <circle cx="25" cy="28" r="2" fill="#4ade80"/>
          </svg>
        </div>
        <h1 className="greeting">Здравствуйте, Александр !</h1>
      </div>

      {/* Alert Cards */}
      <div className="alerts-section">
        <div className="alert-card alert-success">
          <div className="alert-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <polyline points="9 11 12 14 22 4"/>
            </svg>
          </div>
          <div className="alert-content">
            <p className="alert-text">
              Отправляйте электронные письма из службы поддержки, используя собственный домен.
            </p>
            {/* <p className="alert-subtext">
              <span className="days-count">13</span> осталось дней до окончания вашего судебного процесса
            </p> */}
          </div>
          <button className="alert-action">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </button>
        </div>

        <div className="alert-card alert-info">
          <div className="alert-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div className="alert-content">
            <p className="alert-text">
              Защитите свою учетную запись с помощью двухфакторной аутентификации.
            </p>
          </div>
          <button className="alert-action">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Team Invitation Section */}
      <div className="team-section">
        <h2 className="section-title">
          Пригласите свою команду, чтобы максимально эффективно использовать наши продукты.
        </h2>
        
        <div className="team-card">
          <div className="team-members">
            {teamMembers.map((member, index) => (
              <div key={member.id} className={`team-avatar ${member.isOwner ? 'owner' : ''}`}>
                {member.isOwner ? (
                  <svg viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="#1a3a3a"/>
                    <circle cx="15" cy="18" r="3" fill="#4ade80"/>
                    <circle cx="25" cy="18" r="3" fill="#4ade80"/>
                    <circle cx="20" cy="25" r="3" fill="#4ade80"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="18" stroke="#4b5563" strokeWidth="2" fill="none"/>
                    <circle cx="20" cy="16" r="4" fill="#4b5563"/>
                    <path d="M12 28c0-4 4-6 8-6s8 2 8 6" stroke="#4b5563" strokeWidth="2" fill="none"/>
                    <line x1="26" y1="14" x2="28" y2="12" stroke="#4b5563" strokeWidth="2"/>
                    <line x1="28" y1="14" x2="26" y2="12" stroke="#4b5563" strokeWidth="2"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
          
          <button className="invite-button">
            Пригласите больше людей
          </button>

          {/* <div className="team-illustration">
            <svg viewBox="0 0 300 250" fill="none">
              <circle cx="150" cy="200" r="120" fill="#4a2020" opacity="0.6"/>
              <rect x="180" y="160" width="80" height="60" rx="4" fill="#e5e7eb"/>
              <circle cx="220" cy="140" r="35" fill="#374151"/>
              <path d="M195 190 Q220 175 245 190" stroke="#374151" strokeWidth="3" fill="none"/>
              <rect x="215" y="130" width="10" height="15" rx="2" fill="#dc2626"/>
              <ellipse cx="220" cy="125" rx="12" ry="8" fill="#dc2626"/>
            </svg>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Home;