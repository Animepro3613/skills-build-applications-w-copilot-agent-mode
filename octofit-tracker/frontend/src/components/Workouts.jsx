import { useEffect, useState } from 'react';
import { fetchCollection, getApiBaseUrl } from '../lib/api.js';

const endpoint = '/api/workouts/';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadWorkouts() {
      try {
        setStatus('loading');
        setError('');
        const data = await fetchCollection(endpoint);

        if (active) {
          setWorkouts(data);
          setStatus('ready');
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load workouts.');
          setStatus('error');
        }
      }
    }

    loadWorkouts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
          <div>
            <h2 className="h4 mb-1">Workouts</h2>
            <p className="text-body-secondary mb-0">Source: <code>{getApiBaseUrl()}{endpoint}</code></p>
          </div>
          <span className="badge text-bg-info align-self-start text-uppercase">{status}</span>
        </div>

        {error ? <div className="alert alert-danger mb-0">{error}</div> : null}

        {workouts.length > 0 ? (
          <div className="row g-3">
            {workouts.map((workout) => (
              <div className="col-12 col-lg-6" key={workout._id ?? workout.title}>
                <div className="border rounded-3 p-3 h-100">
                  <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                    <h3 className="h5 mb-0">{workout.title ?? 'Workout'}</h3>
                    <span className="badge text-bg-secondary align-self-start">{workout.category ?? 'Workout'}</span>
                  </div>

                  <p className="text-body-secondary mb-3">{workout.focus ?? 'No focus provided.'}</p>

                  <dl className="row small mb-0">
                    <dt className="col-sm-4 text-body-secondary">Difficulty</dt>
                    <dd className="col-sm-8">{workout.difficulty ?? '—'}</dd>

                    <dt className="col-sm-4 text-body-secondary">Duration</dt>
                    <dd className="col-sm-8">{formatDuration(workout.durationMinutes)}</dd>

                    <dt className="col-sm-4 text-body-secondary">Equipment</dt>
                    <dd className="col-sm-8">{formatList(workout.equipment)}</dd>
                  </dl>

                  <p className="mb-0 mt-3">{workout.instructions ?? 'No instructions provided.'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : !error ? (
          <div className="text-body-secondary">No workouts were returned by the API.</div>
        ) : null}
      </div>
    </section>
  );
}

function formatDuration(minutes) {
  return typeof minutes === 'number' ? `${minutes} min` : '—';
}

function formatList(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return '—';
  }

  return values.join(', ');
}