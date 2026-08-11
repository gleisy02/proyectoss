import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Movimiento } from '../types';
import { formatearFecha, formatearMonto } from '../types';

interface Props {
  movimientos: Movimiento[];
  page: number;
  maxPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  loading: boolean;
  onPageChange: (page: number) => void;
  onFilter: (filter: string) => void;
  onEdit: (movimiento: Movimiento) => void;
  onDelete: (movimiento: Movimiento) => void;
}

export default function ListaMovimientos({
  movimientos,
  page,
  maxPages,
  hasPrevious,
  hasNext,
  loading,
  onPageChange,
  onFilter,
  onEdit,
  onDelete,
}: Props) {
  const [filtro, setFiltro] = useState('');

  function aplicarFiltro(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onFilter(filtro);
  }

  return (
    <section className="lista">
      <div className="lista-header">
        <h2>Movimientos</h2>
        <form className="buscador" onSubmit={aplicarFiltro}>
          <input
            type="text"
            placeholder="Buscar por concepto, tipo o categoría..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
      </div>

      {loading ? (
        <p className="mensaje">Cargando movimientos...</p>
      ) : movimientos.length === 0 ? (
        <p className="mensaje">No hay movimientos registrados.</p>
      ) : (
        <>
          <div className="tabla-wrapper">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Concepto</th>
                  <th>Categoría</th>
                  <th>Tipo</th>
                  <th className="col-monto">Monto</th>
                  <th className="col-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((movimiento) => (
                  <tr key={movimiento.id}>
                    <td>{formatearFecha(movimiento.fecha)}</td>
                    <td>{movimiento.concepto}</td>
                    <td className="categoria">{movimiento.categoria}</td>
                    <td>
                      <span className={`badge badge-${movimiento.tipo}`}>
                        {movimiento.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                      </span>
                    </td>
                    <td className={`col-monto monto-${movimiento.tipo}`}>
                      {movimiento.tipo === 'ingreso' ? '+' : '-'}
                      {formatearMonto(movimiento.monto)}
                    </td>
                    <td className="col-acciones">
                      <button className="btn btn-editar" onClick={() => onEdit(movimiento)}>
                        Editar
                      </button>
                      <button className="btn btn-eliminar" onClick={() => onDelete(movimiento)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="paginacion">
            <button
              className="btn"
              disabled={!hasPrevious || loading}
              onClick={() => onPageChange(page - 1)}
            >
              Anterior
            </button>
            <span>
              Página {page} de {maxPages}
            </span>
            <button
              className="btn"
              disabled={!hasNext || loading}
              onClick={() => onPageChange(page + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </section>
  );
}
