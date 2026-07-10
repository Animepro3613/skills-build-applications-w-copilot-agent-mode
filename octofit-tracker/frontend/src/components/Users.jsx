import { useEffect, useState } from 'react';
import { fetchCollection, getApiBaseUrl } from '../lib/api.js';

const endpoint = '/api/users/';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        setStatus('loading');
        setError('');
        const data = await fetchCollection(endpoint);

        if (active) {
          setUsers(data);
          setStatus('ready');
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load users.');
          setStatus('error');
        }
      }
    }

    loadUsers();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
          <div>
            <h2 className="h4 mb-1">Users</h2>
            <p className="text-body-secondary mb-0">Source: <code>{getApiBaseUrl()}{endpoint}</code></p>
          </div>
          <span className="badge text-bg-info align-self-start text-uppercase">{status}</span>
        </div>

        {error ? <div className="alert alert-danger mb-0">{error}</div> : null}

        {users.length > 0 ? (
          <div className="row g-3">
            {users.map((user) => (
              <div className="col-12 col-lg-6" key={user._id ?? user.email}>
                <div className="border rounded-3 p-3 h-100">
                  <div className="d-flex gap-3 align-items-start">
                    <div
                      className="rounded-circle bg-primary-subtle text-primary fw-bold d-inline-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: '3rem', height: '3rem' }}
                    >
                      {initials(user)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex flex-wrap justify-content-between gap-2">
                        <div>
                          <h3 className="h5 mb-1">{fullName(user)}</h3>
                          <p className="text-body-secondary mb-2">{user.email ?? 'No email'}</p>
                        </div>
                        <span className="badge text-bg-primary align-self-start">{user.role ?? 'athlete'}</span>
                      </div>

                      <dl className="row mb-0 small">
                        <dt className="col-sm-5 text-body-secondary">Team</dt>
                        <dd className="col-sm-7">{formatTeam(user.team)}</dd>

                        <dt className="col-sm-5 text-body-secondary">Step goal</dt>
                        <dd className="col-sm-7">{formatNumber(user.stepGoal)}</dd>

                        <dt className="col-sm-5 text-body-secondary">Streak</dt>
                        <dd className="col-sm-7">{formatNumber(user.streakDays)} days</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !error ? (
          <div className="text-body-secondary">No users were returned by the API.</div>
        ) : null}
      </div>
    </section>
  );
}

function fullName(user) {
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unnamed user';
}

function initials(user) {
  return [user.firstName, user.lastName]
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2) || 'U';
}

function formatTeam(team) {
  if (!team) {
    return '—';
  }

  if (typeof team === 'string') {
    return team;
  }

  return team.name || '—';
}

function formatNumber(value) {
  return typeof value === 'number' ? value.toLocaleString() : '—';
}