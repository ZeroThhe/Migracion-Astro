import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, ShoppingBag, Disc, ShieldCheck, Check } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useFlowStore } from '../store/useFlowStore';

/**
 * ProductModal — Detalle de Producto con React Portales (Tema 15)
 * Renderiza el modal sobre la app utilizando React.createPortal() en #modal-portal.
 */
export default function ProductModal() {
  const { quickViewProduct, cerrarModalProducto } = useFlowStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  // Cada vez que se abre (o cambia) un disco, la cantidad regresa a 1
  useEffect(() => {
    setCantidad(1);
    setAgregado(false);
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const handleAgregar = () => {
    addToCart(quickViewProduct, cantidad);
    setAgregado(true);
    setTimeout(() => {
      setAgregado(false);
      cerrarModalProducto();
    }, 1200);
  };

  const portalRoot = document.getElementById('modal-portal') || document.body;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Overlay Backdrop */}
      <div 
        onClick={cerrarModalProducto} 
        className="absolute inset-0" 
      />

      {/* Contenido del Modal con Glassmorphism */}
      <div className="relative z-10 w-full max-w-2xl glass-panel rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl p-6 sm:p-8 bg-[#1B100B]/90">
        <button
          onClick={cerrarModalProducto}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-amber-200 hover:bg-white/20 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          {/* Imagen del Disco */}
          <div className="sm:col-span-5 relative aspect-square rounded-2xl overflow-hidden border border-amber-500/20 shadow-lg">
            <img
              src={quickViewProduct.imagen}
              alt={quickViewProduct.nombre}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <span className="rounded-full bg-black/70 px-3 py-1 text-[10px] font-extrabold text-amber-300 uppercase tracking-widest border border-amber-400/30">
                {quickViewProduct.formato}
              </span>
            </div>
          </div>

          {/* Información y Compra */}
          <div className="sm:col-span-7 space-y-4">
            <div>
              <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">
                {quickViewProduct.artista}
              </span>
              <h2 className="font-serif-poster text-2xl font-bold text-amber-100 leading-tight">
                {quickViewProduct.nombre}
              </h2>
              <p className="mt-1 font-poster text-2xl font-black text-amber-400">
                ${quickViewProduct.precio.toFixed(2)} MXN
              </p>
            </div>

            <p className="text-xs text-amber-200/70 leading-relaxed">
              Prensado de alta fidelidad con empaque de lujo. Incluye funda protectora antiestática para el cuidado óptimo de las pistas de audio.
            </p>

            {/* Selector de Cantidad */}
            <div className="flex items-center gap-3 py-2">
              <span className="text-xs font-semibold text-amber-200/80">Cantidad:</span>
              <div className="flex items-center rounded-full glass-input px-2 py-1">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="h-7 w-7 flex items-center justify-center rounded-full text-amber-300 hover:bg-white/10 font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-bold text-white">{cantidad}</span>
                <button
                  onClick={() => setCantidad(cantidad + 1)}
                  className="h-7 w-7 flex items-center justify-center rounded-full text-amber-300 hover:bg-white/10 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botón de Agregar con Animación de Confirmación */}
            <button
              onClick={handleAgregar}
              disabled={agregado}
              className={`w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                agregado
                  ? 'bg-emerald-500 text-white'
                  : 'glass-btn-primary'
              }`}
            >
              {agregado ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>¡Agregado al Carrito!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>Agregar al Carrito (${(quickViewProduct.precio * cantidad).toFixed(2)})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    portalRoot
  );
}
