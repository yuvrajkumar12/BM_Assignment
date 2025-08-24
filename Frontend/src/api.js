const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function handle(r) {
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || 'Request failed');
  }
  return r.json();
}

export const Forms = {
  list: () => fetch(`${API}/forms`).then(handle),
  get: (id) => fetch(`${API}/forms/${id}`).then(handle),
  create: (data) => fetch(`${API}/forms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handle),
  update: (id, data) => fetch(`${API}/forms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handle),
  remove: (id) => fetch(`${API}/forms/${id}`, { method: 'DELETE' }).then(handle),
  duplicate: (id) => fetch(`${API}/forms/${id}/duplicate`, { method: 'POST' }).then(handle)
};

export const Responses = {
  submit: (formId, answers) => fetch(`${API}/responses/${formId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers })
  }).then(handle),
  list: (formId) => fetch(`${API}/responses/${formId}`).then(handle),
  csvUrl: (formId) => `${API}/responses/${formId}/csv`
};
