const API_BASE = '/api/v1';

let authToken = localStorage.getItem('token');

export const setToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getToken = () => authToken;

const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errorBody.detail || errorBody.message || `Error ${res.status}`);
  }

  if (res.status === 204) return null;

  return res.json();
};

export const login = (email, password) =>
  apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (nombre, email, password) =>
  apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, password, rol: 'CLIENTE' }),
  });

export const getQueue = () =>
  apiFetch('/queue');

export const joinQueue = (nombreCliente, tamanoGrupo) =>
  apiFetch('/queue/join', {
    method: 'POST',
    body: JSON.stringify({ nombreCliente, tamanoGrupo }),
  });

export const cancelTicket = (id) =>
  apiFetch(`/queue/${id}`, { method: 'DELETE' });

export const getTicketStatus = (id) =>
  apiFetch(`/queue/${id}`);

export const subscribeToPush = (subscription, ticketId) => {
  const subData = subscription.toJSON();
  return apiFetch('/push/subscribe', {
    method: 'POST',
    body: JSON.stringify({
      ...subData,
      ticketId
    })
  });
};

export const assignTableToTicket = (ticketId, mesaId) =>
  apiFetch(`/queue/${ticketId}/asignar`, {
    method: 'POST',
    body: JSON.stringify({ mesaId }),
  });

export const getMesas = () =>
  apiFetch('/admin/mesas');

export const createMesa = (numero, capacidad) =>
  apiFetch('/admin/mesas', { method: 'POST', body: JSON.stringify({ numero, capacidad }) });

export const updateMesa = (id, numero, capacidad) =>
  apiFetch(`/admin/mesas/${id}`, { method: 'PUT', body: JSON.stringify({ numero, capacidad }) });

export const changeMesaStatus = (id, estado) =>
  apiFetch(`/admin/mesas/${id}/estado`, { method: 'PUT', body: JSON.stringify({ estado }) });

export const deleteMesa = (id) =>
  apiFetch(`/admin/mesas/${id}`, { method: 'DELETE' });

export const getComandas = () =>
  apiFetch('/kitchen/comandas');

export const createComanda = (mesaId, items, total) =>
  apiFetch('/kitchen/comandas', {
    method: 'POST',
    body: JSON.stringify({ mesaId, items, total }),
  });

export const changeComandaStatus = (id, accion) =>
  apiFetch(`/kitchen/comandas/${id}/estado`, {
    method: 'PUT',
    body: JSON.stringify({ accion }),
  });

export const getDashboardStats = () =>
  apiFetch('/admin/dashboard');

export const getBiStats = () =>
  apiFetch('/admin/dashboard/bi');

export const getProductos = () =>
  apiFetch('/productos');

export const getProductosAdmin = () =>
  apiFetch('/productos/admin');

export const reducirStock = (deducciones) =>
  apiFetch('/productos/reducir-stock', { method: 'POST', body: JSON.stringify(deducciones) });

export const createProducto = (data) =>
  apiFetch('/productos', { method: 'POST', body: JSON.stringify(data) });

export const updateProducto = (id, data) =>
  apiFetch(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const changeProductoStatus = (id, disponible) =>
  apiFetch(`/productos/${id}/disponibilidad`, { method: 'PATCH', body: JSON.stringify({ disponible }) });

export const getMesasFacturacion = () =>
  apiFetch('/billing/mesas');

export const cobrarMesa = (mesaId) =>
  apiFetch(`/billing/mesas/${mesaId}/pagar`, { method: 'POST' });
