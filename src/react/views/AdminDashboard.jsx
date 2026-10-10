import React, { useEffect, useState } from 'react';
import { ArrowLeft, Package, Receipt, BarChart3, Trash2, Pencil, RefreshCw } from 'lucide-react';
import { fetchGraphQL, QUERIES, MUTATIONS } from '../graphql/client';
import { useAuthStore } from '../store/useAuthStore';

/**
 * AdminDashboard — Panel de administración (solo rol ADMIN).
 * Todo sale del backend GraphQL; las mutations están protegidas con IsAdmin en el servidor.
 */
const PRODUCTO_VACIO = {
  nombre: '', artista: '', formato: 'Vinilo 180g', precio: '', imagen: '', stock: 10, destacado: false, categoriaId: 1,
};
const STATUS = ['PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];
const PAGADOS = ['PAGADO', 'ENVIADO', 'ENTREGADO', 'COMPLETADO'];
const COLOR_STATUS = {
  PENDIENTE: 'bg-amber-500/20 text-amber-300',
  PAGADO: 'bg-emerald-500/20 text-emerald-300',
  COMPLETADO: 'bg-emerald-500/20 text-emerald-300',
  ENVIADO: 'bg-sky-500/20 text-sky-300',
  ENTREGADO: 'bg-violet-500/20 text-violet-300',
  CANCELADO: 'bg-rose-500/20 text-rose-300',
};
const dinero = (n) => `$${n.toFixed(2)}`;

export default function AdminDashboard() {
  const usuario = useAuthStore((s) => s.usuario);
  const [tab, setTab] = useState('resumen');
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(PRODUCTO_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      const [p, h, c] = await Promise.all([
        fetchGraphQL(QUERIES.GET_PRODUCTOS, { limit: 500, offset: 0 }),
        fetchGraphQL(QUERIES.HISTORIAL_PEDIDOS),
        fetchGraphQL(QUERIES.GET_CATEGORIAS),
      ]);
      setProductos(p.productos.productos);
      setPedidos(h.historialPedidos);
      setCategorias(c.categorias);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (usuario?.rol === 'ADMIN') cargar();
  }, [usuario]);

  if (usuario?.rol !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-panel rounded-3xl p-8 text-center border border-rose-500/30 max-w-sm">
          <h1 className="font-serif-poster text-2xl font-bold text-rose-200">Acceso restringido</h1>
          <p className="text-xs text-amber-200/70 mt-2 mb-6">Inicia sesión con una cuenta de administrador.</p>
          <a href="/" className="glass-btn-primary rounded-full px-6 py-2.5 text-xs font-bold inline-block">Ir a la tienda</a>
        </div>
      </div>
    );
  }

  // ---------- Productos ----------
  const cambiar = (campo) => (e) =>
    setForm({ ...form, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const guardarProducto = async (e) => {
    e.preventDefault();
    setError(null);
    const input = {
      ...form,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock),
      categoriaId: parseInt(form.categoriaId),
    };
    try {
      if (editandoId) await fetchGraphQL(MUTATIONS.ACTUALIZAR_PRODUCTO, { id: editandoId, input });
      else await fetchGraphQL(MUTATIONS.REGISTRAR_PRODUCTO, { input });
      setForm(PRODUCTO_VACIO);
      setEditandoId(null);
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  const editar = (p) => {
    setEditandoId(p.id);
    setForm({
      nombre: p.nombre, artista: p.artista, formato: p.formato, precio: p.precio,
      imagen: p.imagen, stock: p.stock, destacado: p.destacado, categoriaId: p.categoriaId,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminar = async (p) => {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    try {
      await fetchGraphQL(MUTATIONS.ELIMINAR_PRODUCTO, { id: p.id });
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  // ---------- Pedidos ----------
  const cambiarStatus = async (id, status) => {
    try {
      await fetchGraphQL(MUTATIONS.CAMBIAR_STATUS_PEDIDO, { id, status });
      setPedidos(pedidos.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (err) {
      setError(err.message);
    }
  };

  // ---------- Resumen ----------
  const pagados = pedidos.filter((o) => PAGADOS.includes(o.status));
  const ingresos = pagados.reduce((a, o) => a + o.total, 0);
  const porMetodo = ['PayPal', 'Mercado Pago'].map((m) => ({
    metodo: m,
    total: pagados.filter((o) => o.metodoPago === m).reduce((a, o) => a + o.total, 0),
  }));
  const maxMetodo = Math.max(1, ...porMetodo.map((m) => m.total));
  const pocoStock = productos.filter((p) => p.stock <= 5);

  const tabs = [
    { id: 'resumen', nombre: 'Resumen', icono: BarChart3 },
    { id: 'productos', nombre: 'Productos', icono: Package },
    { id: 'pedidos', nombre: 'Pedidos y pagos', icono: Receipt },
  ];

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-8 sm:px-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <a href="/" className="text-xs text-amber-300 hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Volver a la tienda
          </a>
          <h1 className="font-poster text-3xl font-black text-amber-300 mt-1">Panel de administración</h1>
          <p className="text-xs text-amber-200/60">Sesión: {usuario.nombre}</p>
        </div>
        <button onClick={cargar} className="glass-btn-primary rounded-full px-4 py-2 text-xs font-bold inline-flex items-center gap-2">
          <RefreshCw className={`h-3.5 w-3.5 ${cargando ? 'animate-spin' : ''}`} /> Actualizar
        </button>
      </div>

      <div className="flex gap-2 border-b border-amber-500/20 pb-3">
        {tabs.map(({ id, nombre, icono: Icono }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`rounded-full px-4 py-2 text-xs font-bold inline-flex items-center gap-2 transition-colors ${
              tab === id ? 'bg-pink-500/20 text-pink-200 border border-pink-400/40' : 'text-amber-200/70 hover:bg-white/5'
            }`}
          >
            <Icono className="h-4 w-4" /> {nombre}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">{error}</div>
      )}

      {/* ================= RESUMEN ================= */}
      {tab === 'resumen' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { t: 'Ingresos cobrados', v: `${dinero(ingresos)} MXN`, c: 'text-emerald-300' },
              { t: 'Pedidos pagados', v: pagados.length, c: 'text-amber-300' },
              { t: 'Pendientes de pago', v: pedidos.filter((o) => o.status === 'PENDIENTE').length, c: 'text-amber-300' },
              { t: 'Productos con poco stock', v: pocoStock.length, c: pocoStock.length ? 'text-rose-300' : 'text-amber-300' },
            ].map((k) => (
              <div key={k.t} className="glass-panel rounded-2xl p-5 border border-amber-500/20">
                <p className="text-xs text-amber-200/60">{k.t}</p>
                <p className={`font-poster text-2xl font-black mt-1 ${k.c}`}>{k.v}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-panel rounded-2xl p-5 border border-amber-500/20">
              <h2 className="font-serif-poster text-lg font-bold text-amber-100 mb-4">Cobrado por método de pago</h2>
              {porMetodo.map((m) => (
                <div key={m.metodo} className="mb-3">
                  <div className="flex justify-between text-xs text-amber-200 mb-1">
                    <span>{m.metodo}</span><span className="font-bold">{dinero(m.total)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5">
                    <div
                      className={`h-3 rounded-full ${m.metodo === 'PayPal' ? 'bg-[#0070BA]' : 'bg-[#009EE3]'}`}
                      style={{ width: `${(m.total / maxMetodo) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-amber-500/20">
              <h2 className="font-serif-poster text-lg font-bold text-amber-100 mb-4">Stock bajo (5 o menos)</h2>
              {pocoStock.length === 0 ? (
                <p className="text-xs text-amber-200/60">Todo el inventario está bien surtido.</p>
              ) : (
                <ul className="space-y-2 text-xs">
                  {pocoStock.map((p) => (
                    <li key={p.id} className="flex justify-between text-amber-100">
                      <span className="truncate pr-2">{p.nombre} — {p.artista}</span>
                      <span className="font-bold text-rose-300">{p.stock}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= PRODUCTOS ================= */}
      {tab === 'productos' && (
        <div className="space-y-6">
          <form onSubmit={guardarProducto} className="glass-panel rounded-2xl p-5 border border-amber-500/20 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <h2 className="sm:col-span-2 lg:col-span-4 font-serif-poster text-lg font-bold text-amber-100">
              {editandoId ? `Editar producto #${editandoId}` : 'Agregar producto'}
            </h2>
            <input required placeholder="Álbum" value={form.nombre} onChange={cambiar('nombre')} className="rounded-full glass-input px-4 py-2 text-xs" />
            <input required placeholder="Artista" value={form.artista} onChange={cambiar('artista')} className="rounded-full glass-input px-4 py-2 text-xs" />
            <input required placeholder="Formato" value={form.formato} onChange={cambiar('formato')} className="rounded-full glass-input px-4 py-2 text-xs" />
            <select value={form.categoriaId} onChange={cambiar('categoriaId')} className="rounded-full glass-input px-4 py-2 text-xs">
              {categorias.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#180D09]">{c.nombre}</option>
              ))}
            </select>
            <input required type="number" min="1" step="0.01" placeholder="Precio MXN" value={form.precio} onChange={cambiar('precio')} className="rounded-full glass-input px-4 py-2 text-xs" />
            <input required type="number" min="0" placeholder="Stock" value={form.stock} onChange={cambiar('stock')} className="rounded-full glass-input px-4 py-2 text-xs" />
            <input required placeholder="URL de la imagen" value={form.imagen} onChange={cambiar('imagen')} className="rounded-full glass-input px-4 py-2 text-xs sm:col-span-2" />
            <label className="flex items-center gap-2 text-xs text-amber-200">
              <input type="checkbox" checked={form.destacado} onChange={cambiar('destacado')} /> Destacado
            </label>
            <div className="sm:col-span-2 lg:col-span-3 flex gap-2 justify-end">
              {editandoId && (
                <button type="button" onClick={() => { setEditandoId(null); setForm(PRODUCTO_VACIO); }} className="rounded-full px-4 py-2 text-xs text-amber-200 hover:bg-white/5">
                  Cancelar
                </button>
              )}
              <button type="submit" className="glass-btn-pink rounded-full px-6 py-2 text-xs font-bold">
                {editandoId ? 'Guardar cambios' : 'Agregar'}
              </button>
            </div>
          </form>

          <div className="overflow-x-auto glass-panel rounded-2xl border border-amber-500/20">
            <table className="w-full text-left text-xs">
              <thead className="text-amber-200/60 border-b border-amber-500/20">
                <tr>
                  <th className="p-3">Producto</th><th className="p-3">Formato</th>
                  <th className="p-3">Precio</th><th className="p-3">Stock</th><th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id} className="border-b border-amber-500/10 text-amber-100">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={p.imagen} alt="" className="h-10 w-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold">{p.nombre}</p>
                          <p className="text-amber-200/60">{p.artista}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{p.formato}</td>
                    <td className="p-3 font-bold text-amber-300">{dinero(p.precio)}</td>
                    <td className={`p-3 font-bold ${p.stock <= 5 ? 'text-rose-300' : ''}`}>{p.stock}</td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <button onClick={() => editar(p)} title="Editar" className="p-1.5 text-sky-300 hover:text-sky-200"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => eliminar(p)} title="Eliminar" className="p-1.5 text-rose-400 hover:text-rose-300"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= PEDIDOS ================= */}
      {tab === 'pedidos' && (
        <div className="overflow-x-auto glass-panel rounded-2xl border border-amber-500/20">
          <table className="w-full text-left text-xs">
            <thead className="text-amber-200/60 border-b border-amber-500/20">
              <tr>
                <th className="p-3">Folio</th><th className="p-3">Fecha</th><th className="p-3">Cliente</th>
                <th className="p-3">Artículos</th><th className="p-3">Total</th><th className="p-3">Pago</th><th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((o) => (
                <tr key={o.id} className="border-b border-amber-500/10 text-amber-100 align-top">
                  <td className="p-3 font-bold">#{o.id}</td>
                  <td className="p-3 whitespace-nowrap">{o.fecha}</td>
                  <td className="p-3">{o.usuario?.nombre}<p className="text-amber-200/50">{o.usuario?.email}</p></td>
                  <td className="p-3">
                    {o.detalles.map((d, i) => (
                      <p key={i}>{d.cantidad}× {d.producto?.nombre || '(producto eliminado)'}</p>
                    ))}
                  </td>
                  <td className="p-3 font-bold text-amber-300">{dinero(o.total)}</td>
                  <td className="p-3">
                    {o.metodoPago}
                    {o.referenciaPago && <p className="text-amber-200/50 break-all">Ref: {o.referenciaPago}</p>}
                  </td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => cambiarStatus(o.id, e.target.value)}
                      className={`rounded-full px-2 py-1 font-bold border-0 ${COLOR_STATUS[o.status] || ''}`}
                    >
                      {(STATUS.includes(o.status) ? STATUS : [o.status, ...STATUS]).map((s) => (
                        <option key={s} value={s} className="bg-[#180D09] text-white">{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
