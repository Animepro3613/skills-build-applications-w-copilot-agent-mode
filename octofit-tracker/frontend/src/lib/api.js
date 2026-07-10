const fallbackBaseUrl = 'http://localhost:8000';

export function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

  if (!codespaceName) {
    return fallbackBaseUrl;
  }

  return `https://${codespaceName}-8000.app.github.dev`;
}

function normalizeCollectionResponse(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const candidates = [payload.results, payload.items, payload.data, payload.records];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate;
      }

      if (candidate && typeof candidate === 'object') {
        const nested = [candidate.results, candidate.items, candidate.data, candidate.records];

        for (const nestedCandidate of nested) {
          if (Array.isArray(nestedCandidate)) {
            return nestedCandidate;
          }
        }
      }
    }
  }

  return [];
}

export async function fetchCollection(pathname) {
  const response = await fetch(`${getApiBaseUrl()}${pathname}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const payload = await response.json();

  return normalizeCollectionResponse(payload);
}