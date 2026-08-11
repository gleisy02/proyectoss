import { useCallback, useEffect, useState } from 'react';
import './App.css';
import type { Movimiento, MovimientoInput } from './types';
import {
  actualizarMovimiento,
  crearMovimiento,
  eliminarMovimiento,
  obtenerPaginados,
  obtenerTodos,
} from './api';
import Resumen from './components/Resumen';
import ListaMovimientos from './components/ListaMovimientos';
import ModalForm from './components/ModalForm';
import ModalConfirmar from './components/ModalConfirmar';

type FormState =
  | { modo: 'crear'; movimiento?: undefined }
  | { modo: 'editar'; movimiento: Movimiento };

function App() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [todos, setTodos] = useState<Movimiento[]>([]);
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [formState, setFormState] = useState<FormState | null>(null);
  const [eliminar, setEliminar] = useState<Movimiento | null>(null);
  const [notificacion, setNotificacion] = useState('');

  const cargarLista = useCallback(async (pagina: number, textoFiltro: string) => {
    setLoading(true);
    try {
      const respuesta = await obtenerPaginados(pagina, textoFiltro);
      setMovimientos(respuesta.datos);
      setPage(respuesta.currentpage);
      setMaxPages(respuesta.maxPages);
      setHasPrevious(respuesta.previous);
      setHasNext(respuesta.next);
    } catch (err) {
      setNotificacion(err instanceof Error ? err.message : 'Error al cargar los movimientos.');
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarResumen = useCallback(async () => {
    try {
      setTodos(await obtenerTodos());
    } catch (err) {
      setNotificacion(err instanceof Error ? err.message : 'Error al cargar el resumen.');
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void cargarLista(page, filtro);
    }, 0);
    return () => window.clearTimeout(id);
  }, [cargarLista, page, filtro]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void cargarResumen();
    }, 0);
    return () => window.clearTimeout(id);
  }, [cargarResumen]);

  function cambiarPagina(nuevaPagina: number) {
    setPage(nuevaPagina);
  }

  function cambiarFiltro(texto: string) {
    setFiltro(texto);
    setPage(1);
  }

  function mostrarMensaje(texto: string) {
    setNotificacion(texto);
    window.setTimeout(() => setNotificacion(''), 3000);
  }

  async function manejarGuardar(data: MovimientoInput) {
    if (formState?.modo === 'editar') {
      await actualizarMovimiento(formState.movimiento.id, data);
      mostrarMensaje('Movimiento actualizado correctamente.');
    } else {
      await crearMovimiento(data);
      mostrarMensaje('Movimiento registrado correctamente.');
    }
    setFormState(null);
    await Promise.all([cargarLista(page, filtro), cargarResumen()]);
  }

  async function manejarEliminar() {
    if (!eliminar) return;
    await eliminarMovimiento(eliminar.id);
    mostrarMensaje('Movimiento eliminado correctamente.');
    setEliminar(null);
    const ultimaPagina = movimientos.length === 1 && page > 1 ? page - 1 : page;
    await Promise.all([cargarLista(ultimaPagina, filtro), cargarResumen()]);
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Finanzas Personales</h1>
        <button className="btn btn-primario" onClick={() => setFormState({ modo: 'crear' })}>
          + Nuevo movimiento
        </button>
      </header>

      {notificacion && <div className="notificacion">{notificacion}</div>}

      <Resumen movimientos={todos} />

      <ListaMovimientos
        movimientos={movimientos}
        page={page}
        maxPages={maxPages}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        loading={loading}
        onPageChange={cambiarPagina}
        onFilter={cambiarFiltro}
        onEdit={(movimiento) => setFormState({ modo: 'editar', movimiento })}
        onDelete={setEliminar}
      />

      {formState && (
        <ModalForm
          modo={formState.modo}
          movimiento={formState.movimiento}
          onClose={() => setFormState(null)}
          onSubmit={manejarGuardar}
        />
      )}

      {eliminar && (
        <ModalConfirmar
          movimiento={eliminar}
          onClose={() => setEliminar(null)}
          onConfirm={manejarEliminar}
        />
      )}
    </div>
  );
}

export default App;
