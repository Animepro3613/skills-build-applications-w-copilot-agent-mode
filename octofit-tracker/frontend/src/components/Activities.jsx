import { useEffect, useState } from 'react';
import { fetchCollection, getApiBaseUrl } from '../lib/api.js';

const endpoint = '/api/activities/';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadActivities() {
      try {
        setStatus('loading');
        setError('');
        const data = await fetchCollection(endpoint);

        if (active) {
          setActivities(data);
          setStatus('ready');
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load activities.');
          setStatus('error');
        }
      }
    }

    loadActivities();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
          <div>
            <h2 className="h4 mb-1">Activities</h2>
            <p className="text-body-secondary mb-0">Source: <code>{getApiBaseUrl()}{endpoint}</code></p>
          </div>
          <span className="badge text-bg-info align-self-start text-uppercase">{status}</span>
        </div>

        {error ? <div className="alert alert-danger mb-0">{error}</div> : null}

        {!error && activities.length === 0 ? (
          <div className="text-body-secondary">No activities were returned by the API.</div>
        ) : null}

        {activities.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>User</th>
                  <th>Team</th>
                  <th>Duration</th>
                  <th>Calories</th>
                  <th>When</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity._id ?? `${activity.type}-${activity.occurredAt}`}>
                    <td>{activity.type ?? 'Unknown'}</td>
                    <td>{formatPerson(activity.user)}</td>
                    <td>{formatTeam(activity.team)}</td>
                    <td>{formatDuration(activity.durationMinutes)}</td>
                    <td>{formatNumber(activity.caloriesBurned)}</td>
                    <td>{formatDate(activity.occurredAt)}</td>
                    <td>{activity.notes ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

function formatTeam(team) {
  if (!team) {
    return '—';
  }

  if (typeof team === 'string') {
    return team;
  }

  return team.name || '—';
}

function formatDuration(minutes) {
  return typeof minutes === 'number' ? `${minutes} min` : '—';
}

function formatNumber(value) {
  return typeof value === 'number' ? value.toLocaleString() : '—';
}

function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
}