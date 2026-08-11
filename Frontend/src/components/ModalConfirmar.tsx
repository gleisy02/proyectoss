import { useState } from 'react';
import type { Movimiento } from '../types';

interface Props {
  movimiento: Movimiento;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function ModalConfirmar({ movimiento, onClose, onConfirm }: Props) {
  const [error, setError] = useState('');
  const [eliminando, setEliminando] = useState(false);

  async function confirmar() {
    setError('');
    setEliminando(true);
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el movimiento.');
      setEliminando(false);
    }
  }

  return (
    <div className="modal-fondo" onClick={onClose}>
      <div className="modal modal-chica" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Eliminar movimiento</h2>
          <button className="modal-cerrar" onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
        </div>

        <p className="modal-texto">
          ¿Estás seguro de que deseas eliminar el movimiento{' '}
          <strong>&ldquo;{movimiento.concepto}&rdquo;</strong>? Esta acción no se puede deshacer.
        </p>

        {error && <p className="error">{error}</p>}

        <div className="modal-acciones">
          <button type="button" className="btn btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn btn-eliminar" onClick={confirmar} disabled={eliminando}>
            {eliminando ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
