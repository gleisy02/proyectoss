import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Movimiento, MovimientoInput, TipoMovimiento } from '../types';
import { CATEGORIAS_POR_TIPO } from '../types';

interface Props {
  modo: 'crear' | 'editar';
  movimiento?: Movimiento | null;
  onClose: () => void;
  onSubmit: (data: MovimientoInput) => Promise<void>;
}

export default function ModalForm({ modo, movimiento, onClose, onSubmit }: Props) {
  const [concepto, setConcepto] = useState(movimiento?.concepto ?? '');
  const [monto, setMonto] = useState(movimiento?.monto ?? '');
  const [tipo, setTipo] = useState<TipoMovimiento>(movimiento?.tipo ?? 'ingreso');
  const [categoria, setCategoria] = useState(
    movimiento?.categoria ?? CATEGORIAS_POR_TIPO.ingreso[0],
  );
  const [fecha, setFecha] = useState(movimiento?.fecha ?? '');
  const [nota, setNota] = useState(movimiento?.nota ?? '');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  function cambiarTipo(nuevoTipo: TipoMovimiento) {
    setTipo(nuevoTipo);
    setCategoria(CATEGORIAS_POR_TIPO[nuevoTipo][0] ?? '');
  }

  async function manejarEnvio(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!concepto.trim() || !monto || !categoria || !fecha) {
      setError('Complete todos los campos obligatorios.');
      return;
    }

    if (parseFloat(monto) <= 0) {
      setError('El monto debe ser mayor que cero.');
      return;
    }

    setGuardando(true);
    try {
      await onSubmit({
        concepto: concepto.trim(),
        monto,
        tipo,
        categoria,
        fecha,
        nota: nota.trim() || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el movimiento.');
      setGuardando(false);
    }
  }

  return (
    <div className="modal-fondo" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{modo === 'crear' ? 'Nuevo movimiento' : 'Editar movimiento'}</h2>
          <button className="modal-cerrar" onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
        </div>

        <form className="formulario" onSubmit={manejarEnvio}>
          <div className="campo">
            <label htmlFor="concepto">Concepto *</label>
            <input
              id="concepto"
              type="text"
              placeholder="Ej: Sueldo de agosto"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="monto">Monto *</label>
            <input
              id="monto"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
          </div>

          <div className="campo">
            <label>Tipo *</label>
            <div className="selector-tipo">
              <button
                type="button"
                className={`tipo-option ${tipo === 'ingreso' ? 'activo-ingreso' : ''}`}
                onClick={() => cambiarTipo('ingreso')}
              >
                Ingreso
              </button>
              <button
                type="button"
                className={`tipo-option ${tipo === 'gasto' ? 'activo-gasto' : ''}`}
                onClick={() => cambiarTipo('gasto')}
              >
                Gasto
              </button>
            </div>
          </div>

          <div className="campo">
            <label htmlFor="categoria">Categoría *</label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              {CATEGORIAS_POR_TIPO[tipo].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="fecha">Fecha *</label>
            <input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="nota">Nota</label>
            <textarea
              id="nota"
              rows={3}
              placeholder="Detalle adicional (opcional)"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />
          </div>

          {error && <p className="error">{error}</p>}

          <div className="modal-acciones">
            <button type="button" className="btn btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primario" disabled={guardando}>
              {guardando ? 'Guardando...' : modo === 'crear' ? 'Guardar' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
