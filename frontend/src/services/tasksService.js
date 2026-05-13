const BASE = `${import.meta.env.VITE_API_BASE || ''}/api/tasks`;

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const tasksService = {
  getAll(status) {
    const url = status ? `${BASE}?status=${status}` : BASE;
    return fetch(url).then(handleResponse);
  },

  create(payload) {
    return fetch(BASE, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    }).then(handleResponse);
  },

  update(id, payload) {
    return fetch(`${BASE}/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    }).then(handleResponse);
  },

  toggle(id) {
    return fetch(`${BASE}/${id}/toggle`, {
      method: 'PATCH',
    }).then(handleResponse);
  },

  delete(id) {
    return fetch(`${BASE}/${id}`, {
      method: 'DELETE',
    }).then(handleResponse);
  },
};