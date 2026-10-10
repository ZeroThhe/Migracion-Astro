import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Truck, CheckCircle2, Lock } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useFlowStore } from '../store/useFlowStore';
import { fetchGraphQL, MUTATIONS } from '../graphql/client';
import PaymentMethods from '../components/PaymentMethods';

/**
 * CheckoutView — Finalización de Compra (Sección 7.2)
 * Paso 1: dirección + método → `registrarPedido` crea el pedido PENDIENTE.
 * Paso 2: se paga con PayPal o Mercado Pago (PaymentMethods).
 */
export default function CheckoutView() {
  const { cartItems, getTotalPrice, clearCart } = useCartStore();
  const { volver, pedidoCreado } = useFlowStore();

  const [direccionEnvio, setDireccionEnvio] = useState("Av. Las Palmas #450, Col. Centro, Guadalajara, JAL");
  const [metodoPago, setMetodoPago] = useState("PayPal");
  const [pedido, setPedido] = useState(null); // pedido PENDIENTE ya creado en el backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalPrice = getTotalPrice();

  const handleConfirmarPedido = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Formatear renglones para la Mutation PedidoInput
      // Solo producto y cantidad: el precio y el usuario los pone el servidor
      const detalles = cartItems.map((item) => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
      }));

      const data = await fetchGraphQL(MUTATIONS.REGISTRAR_PEDIDO, {
        datos: { direccionEnvio, metodoPago, detalles },
      });
      setPedido(data.registrarPedido); // queda PENDIENTE hasta pagar
    } catch (err) {
      console.error("Error al registrar pedido:", err);
      setError(err.message || "Ocurrió un error al procesar el pedido en el servidor GraphQL.");
    } finally {
      setLoading(false);
    }
  };

  // Pago confirmado por el backend → vaciar carrito y mostrar recibo
  const handlePagado = (orden) => {
    clearCart();
    pedidoCreado(orden);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button
        onClick={volver}
        className="glass-btn-primary rounded-full px-4 py-1.5 text-xs font-bold inline-flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Volver al Carrito</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Formulario de Checkout */}
        <div className="md:col-span-7 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30">
            <h2 className="font-serif-poster text-xl font-bold text-amber-100 mb-6 flex items-center gap-2 border-b border-amber-500/15 pb-3">
              <Truck className="h-5 w-5 text-amber-400" />
              <span>Datos de Envío & Pago</span>
            </h2>

            {pedido ? (
              <PaymentMethods pedido={pedido} onPagado={handlePagado} />
            ) : (
            <form onSubmit={handleConfirmarPedido} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-amber-200 block mb-1.5">
                  Dirección Completa de Envío
                </label>
                <textarea
                  rows="3"
                  value={direccionEnvio}
                  onChange={(e) => setDireccionEnvio(e.target.value)}
                  required
                  className="w-full rounded-2xl glass-input p-3 text-xs"
                  placeholder="Calle, número, colonia, código postal y ciudad..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-amber-200 block mb-1.5">
                  Método de Pago
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { valor: 'PayPal', nota: 'Cuenta PayPal o tarjeta' },
                    { valor: 'Mercado Pago', nota: 'Tarjeta, OXXO o saldo MP' },
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.valor}
                      onClick={() => setMetodoPago(m.valor)}
                      className={`rounded-2xl p-3 text-left border transition-colors ${
                        metodoPago === m.valor
                          ? 'border-pink-400 bg-pink-500/15'
                          : 'border-amber-500/20 hover:bg-white/5'
                      }`}
                    >
                      <span className="block text-sm font-bold text-amber-100">{m.valor}</span>
                      <span className="block text-[10px] text-amber-200/60">{m.nota}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full glass-btn-pink rounded-full py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <span>Creando pedido...</span>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Continuar al pago (${totalPrice.toFixed(2)} MXN)</span>
                  </>
                )}
              </button>
            </form>
            )}
          </div>
        </div>

        {/* Resumen Lateral */}
        <div className="md:col-span-5">
          <div className="glass-panel rounded-3xl p-6 border border-amber-500/30 space-y-4">
            <h3 className="font-serif-poster text-base font-bold text-amber-100 border-b border-amber-500/15 pb-3">
              Renglones del Pedido ({cartItems.length})
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cartItems.map(({ producto, cantidad }) => (
                <div key={producto.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-bold text-amber-400">{cantidad}x</span>
                    <span className="text-amber-100/90 truncate">{producto.nombre}</span>
                  </div>
                  <span className="font-bold text-amber-300 shrink-0">
                    ${(producto.precio * cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-amber-500/15 flex justify-between items-center">
              <span className="font-poster text-xs font-bold text-amber-200 uppercase">Total Final</span>
              <span className="font-poster text-xl font-black text-amber-300">
                ${totalPrice.toFixed(2)} MXN
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
