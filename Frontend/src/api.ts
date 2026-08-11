import type {
  ApiResponse,
  Movimiento,
  MovimientoInput,
  PaginatorResponse,
} from './types';

const BASE = '/movimientos';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const respuesta = await fetch(url, options);
  const json: ApiResponse | PaginatorResponse = await respuesta.json();

  if (!json.success) {
    const mensaje = Array.isArray(json.Mensaje)
      ? json.Mensaje.join(', ')
      : json.Mensaje;
    throw new Error(mensaje || 'Ocurrió un error en la solicitud');
  }

  return json as T;
}

export function obtenerPaginados(
  page: number,
  filter = '',
): Promise<PaginatorResponse> {
  const params = new URLSearchParams({ page: String(page) });
  if (filter.trim()) params.set('filter', filter.trim());
  return request<PaginatorResponse>(`${BASE}/paginator?${params.toString()}`);
}

export async function obtenerTodos(): Promise<Movimiento[]> {
  const respuesta = await request<ApiResponse>(`${BASE}/`);
  return respuesta.datos as Movimiento[];
}

export function crearMovimiento(data: MovimientoInput): Promise<ApiResponse> {
  return request<ApiResponse>(`${BASE}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function actualizarMovimiento(
  id: number,
  data: MovimientoInput,
): Promise<ApiResponse> {
  return request<ApiResponse>(`${BASE}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });
}

export function eliminarMovimiento(id: number): Promise<ApiResponse> {
  return request<ApiResponse>(`${BASE}/delete?id=${id}`, {
    method: 'DELETE',
  });
}
