import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Teams from './components/Teams.jsx';
import Users from './components/Users.jsx';
import Workouts from './components/Workouts.jsx';

const navigationItems = [
  { to: '/users', label: 'Users' },
  { to: '/teams', label: 'Teams' },
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/workouts', label: 'Workouts' }
];

export default function App() {
  return (
    <div className="min-vh-100 bg-body-tertiary">
      <header className="border-bottom bg-white shadow-sm">
        <div className="container py-3 d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3">
          <div>
            <p className="text-uppercase text-primary fw-semibold small mb-1">OctoFit Tracker</p>
            <h1 className="h3 fw-bold mb-1">Presentation Tier</h1>
            <p className="text-body-secondary mb-0">
              Set VITE_CODESPACE_NAME in .env.local so the frontend can build Codespaces API URLs.
            </p>
          </div>
          <img
            src="/docs/octofitapp-small.png"
            alt="OctoFit Tracker logo"
            className="rounded shadow-sm"
            style={{ width: '72px', height: '72px', objectFit: 'cover' }}
          />
        </div>
        <nav className="border-top">
          <div className="container py-2 d-flex flex-wrap gap-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-primary'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  );
}
