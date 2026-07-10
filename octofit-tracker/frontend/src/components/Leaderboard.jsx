import { useEffect, useState } from 'react';
import { fetchCollection, getApiBaseUrl } from '../lib/api.js';

const endpoint = '/api/leaderboard/';

export default function Leaderboard() {
  const [leaderboards, setLeaderboards] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadLeaderboards() {
      try {
        setStatus('loading');
        setError('');
        const data = await fetchCollection(endpoint);

        if (active) {
          setLeaderboards(data);
          setStatus('ready');
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load leaderboard data.');
          setStatus('error');
        }
      }
    }

    loadLeaderboards();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
          <div>
            <h2 className="h4 mb-1">Leaderboard</h2>
            <p className="text-body-secondary mb-0">Source: <code>{getApiBaseUrl()}{endpoint}</code></p>
          </div>
          <span className="badge text-bg-info align-self-start text-uppercase">{status}</span>
        </div>

        {error ? <div className="alert alert-danger mb-0">{error}</div> : null}

        {leaderboards.length > 0 ? (
          <div className="row g-3">
            {leaderboards.map((leaderboard) => (
              <div className="col-12" key={leaderboard._id ?? leaderboard.title}>
                <div className="border rounded-3 p-3">
                  <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
                    <div>
                      <h3 className="h5 mb-1">{leaderboard.title ?? 'Leaderboard'}</h3>
                      <p className="text-body-secondary mb-0">Generated {formatDate(leaderboard.generatedAt)}</p>
                    </div>
                    <span className="badge text-bg-dark align-self-start">
                      {Array.isArray(leaderboard.entries) ? leaderboard.entries.length : 0} entries
                    </span>
                  </div>

                  {Array.isArray(leaderboard.entries) && leaderboard.entries.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Rank</th>
                            <th>Label</th>
                            <th>Type</th>
                            <th>Points</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaderboard.entries.map((entry) => (
                            <tr key={`${entry.rank}-${entry.label}`}>
                              <td>{formatNumber(entry.rank)}</td>
                              <td>{entry.label ?? '—'}</td>
                              <td>{entry.entityType ?? '—'}</td>
                              <td>{formatNumber(entry.points)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-body-secondary">This leaderboard has no entries.</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : !error ? (
          <div className="text-body-secondary">No leaderboard data was returned by the API.</div>
        ) : null}
      </div>
    </section>
  );
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