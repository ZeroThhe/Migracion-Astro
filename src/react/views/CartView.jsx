import React from 'react';
import { ShoppingBag, Trash2, ArrowLeft, ArrowRight, Disc } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useFlowStore } from '../store/useFlowStore';

/**
 * CartView — Carrito de Compras (Sección 5.2 & 5.5)
 */
export default function CartView() {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCartStore();
  const { volver, finalizarCompra, irAlHome } = useFlowStore();

  const totalPrice = getTotalPrice();

  if (cartItems.length === 0) {
    return (
      <div className="space-y-6">
        <button
          onClick={volver}
          className="glass-btn-primary rounded-full px-4 py-1.5 text-xs font-bold inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>

        <div className="glass-panel rounded-3xl p-12 text-center border border-amber-500/20 max-w-lg mx-auto">
          <Disc className="h-16 w-16 text-amber-400/30 mx-auto mb-4 vinyl-spin" />
          <h2 className="font-serif-poster text-2xl font-bold text-amber-100">
            Tu carrito está vacío
          </h2>
          <p className="text-xs text-amber-200/60 mt-2 mb-6">
            Aún no has agregado ningún vinilo o CD a tu orden.
          </p>
          <button
            onClick={irAlHome}
            className="glass-btn-primary rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
          >
            Explorar Catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Carrito */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
        <button
          onClick={volver}
          className="glass-btn-primary rounded-full px-4 py-1.5 text-xs font-bold inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>

        <h1 className="font-poster text-2xl font-black uppercase text-amber-300">
          Mi Carrito de Compras
        </h1>

        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:underline font-semibold"
        >
          Vaciar Carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lista de Renglones del Carrito */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map(({ producto, cantidad }) => (
            <div
              key={producto.id}
              className="glass-panel rounded-2xl p-4 border border-amber-500/20 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="h-16 w-16 rounded-xl object-cover border border-amber-500/20"
                />
                <div>
                  <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest block">
                    {producto.artista}
                  </span>
                  <h3 className="font-serif-poster text-base font-bold text-amber-100">
                    {producto.nombre}
                  </h3>
                  <span className="text-xs font-semibold text-amber-300">
                    ${producto.precio.toFixed(2)} MXN c/u
                  </span>
                </div>
              </div>

              {/* Modificador de Cantidad & Eliminar */}
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-full glass-input px-2 py-0.5">
                  <button
                    onClick={() => updateQuantity(producto.id, cantidad - 1)}
                    className="h-6 w-6 flex items-center justify-center text-amber-300 font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-white">{cantidad}</span>
                  <button
                    onClick={() => updateQuantity(producto.id, cantidad + 1)}
                    className="h-6 w-6 flex items-center justify-center text-amber-300 font-bold"
                  >
                    +
                  </button>
                </div>

                <span className="font-poster text-sm font-black text-amber-300 w-24 text-right">
                  ${(producto.precio * cantidad).toFixed(2)}
                </span>

                <button
                  onClick={() => removeFromCart(producto.id)}
                  className="p-1.5 text-rose-400/70 hover:text-rose-400 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen de Pedido */}
        <div className="lg:col-span-4">
          <div className="glass-panel rounded-3xl p-6 border border-amber-500/30 space-y-4 sticky top-24">
            <h2 className="font-serif-poster text-lg font-bold text-amber-100 border-b border-amber-500/15 pb-3">
              Resumen del Pedido
            </h2>

            <div className="space-y-2 text-xs text-amber-200/80">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.reduce((a, b) => a + b.cantidad, 0)} items)</span>
                <span className="font-bold text-white">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío estimado</span>
                <span className="text-emerald-400 font-bold">GRATIS</span>
              </div>
            </div>

            <div className="pt-3 border-t border-amber-500/15 flex justify-between items-center">
              <span className="font-poster text-sm font-bold text-amber-200 uppercase">Total</span>
              <span className="font-poster text-2xl font-black text-amber-300">
                ${totalPrice.toFixed(2)} MXN
              </span>
            </div>

            <button
              onClick={finalizarCompra}
              className="w-full glass-btn-primary rounded-full py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Proceder al Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
