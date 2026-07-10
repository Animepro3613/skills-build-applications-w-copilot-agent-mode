import { useEffect, useState } from 'react';
import { fetchCollection, getApiBaseUrl } from '../lib/api.js';

const endpoint = '/api/teams/';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadTeams() {
      try {
        setStatus('loading');
        setError('');
        const data = await fetchCollection(endpoint);

        if (active) {
          setTeams(data);
          setStatus('ready');
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load teams.');
          setStatus('error');
        }
      }
    }

    loadTeams();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
          <div>
            <h2 className="h4 mb-1">Teams</h2>
            <p className="text-body-secondary mb-0">Source: <code>{getApiBaseUrl()}{endpoint}</code></p>
          </div>
          <span className="badge text-bg-info align-self-start text-uppercase">{status}</span>
        </div>

        {error ? <div className="alert alert-danger mb-0">{error}</div> : null}

        {teams.length > 0 ? (
          <div className="row g-3">
            {teams.map((team) => (
              <div className="col-12 col-lg-6" key={team._id ?? team.name}>
                <div className="border rounded-3 p-3 h-100">
                  <div className="d-flex justify-content-between gap-2 mb-3">
                    <div>
                      <h3 className="h5 mb-1">{team.name ?? 'Team'}</h3>
                      <p className="text-body-secondary mb-0">Coach: {team.coach ?? '—'}</p>
                    </div>
                    <span className="badge text-bg-success align-self-start">
                      {Array.isArray(team.members) ? team.members.length : 0} members
                    </span>
                  </div>

                  <p className="mb-3">{team.description ?? 'No team description provided.'}</p>

                  <div className="small text-body-secondary mb-2">Weekly goal: {formatNumber(team.weeklyGoal)}</div>

                  {Array.isArray(team.members) && team.members.length > 0 ? (
                    <ul className="list-group list-group-flush">
                      {team.members.map((member) => (
                        <li className="list-group-item px-0" key={member._id ?? member.email ?? member.firstName}>
                          {formatPerson(member)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-body-secondary">No members were returned for this team.</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : !error ? (
          <div className="text-body-secondary">No teams were returned by the API.</div>
        ) : null}
      </div>
    </section>
  );
}

function formatPerson(person) {
  if (!person) {
    return '—';
  }

  if (typeof person === 'string') {
    return person;
  }

  return [person.firstName, person.lastName].filter(Boolean).join(' ') || person.email || '—';
}

function formatNumber(value) {
  return typeof value === 'number' ? value.toLocaleString() : '—';
}