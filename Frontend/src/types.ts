export type TipoMovimiento = 'ingreso' | 'gasto';

export interface Movimiento {
  id: number;
  concepto: string;
  monto: string;
  tipo: TipoMovimiento;
  categoria: string;
  fecha: string;
  nota: string | null;
}

export interface MovimientoInput {
  concepto: string;
  monto: string;
  tipo: TipoMovimiento;
  categoria: string;
  fecha: string;
  nota?: string | null;
}

export interface ApiResponse {
  success: boolean;
  Mensaje: string | string[];
  datos: unknown;
  status: number;
}

export interface PaginatorResponse {
  success: boolean;
  Mensaje: string;
  datos: Movimiento[];
  maxPages: number;
  currentpage: number;
  previous: boolean;
  next: boolean;
  status: number;
}

export const CATEGORIAS_POR_TIPO: Record<TipoMovimiento, string[]> = {
  ingreso: ['salario', 'bonos', 'inversiones'],
  gasto: ['comida', 'transporte', 'alquiler', 'otros'],
};

export function formatearMonto(monto: string | number): string {
  const numero = typeof monto === 'string' ? parseFloat(monto) : monto;
  if (Number.isNaN(numero)) return '$0.00';
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 2,
  }).format(numero);
}

export function formatearFecha(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}
