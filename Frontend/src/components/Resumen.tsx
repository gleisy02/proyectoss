import type { Movimiento } from '../types';
import { formatearMonto } from '../types';

interface Props {
  movimientos: Movimiento[];
}

export default function Resumen({ movimientos }: Props) {
  const totalIngresos = movimientos
    .filter((m) => m.tipo === 'ingreso')
    .reduce((acc, m) => acc + parseFloat(m.monto), 0);

  const totalGastos = movimientos
    .filter((m) => m.tipo === 'gasto')
    .reduce((acc, m) => acc + parseFloat(m.monto), 0);

  const balance = totalIngresos - totalGastos;

  return (
    <section className="resumen">
      <div className="card resumen-ingresos">
        <span className="card-etiqueta">Ingresos</span>
        <span className="card-valor">{formatearMonto(totalIngresos)}</span>
        <span className="card-sub">{movimientos.filter((m) => m.tipo === 'ingreso').length} movimientos</span>
      </div>

      <div className="card resumen-gastos">
        <span className="card-etiqueta">Gastos</span>
        <span className="card-valor">{formatearMonto(totalGastos)}</span>
        <span className="card-sub">{movimientos.filter((m) => m.tipo === 'gasto').length} movimientos</span>
      </div>

      <div className={`card resumen-balance ${balance >= 0 ? 'positivo' : 'negativo'}`}>
        <span className="card-etiqueta">Balance</span>
        <span className="card-valor">{formatearMonto(balance)}</span>
        <span className="card-sub">{balance >= 0 ? 'Saldo disponible' : 'Saldo negativo'}</span>
      </div>
    </section>
  );
}
