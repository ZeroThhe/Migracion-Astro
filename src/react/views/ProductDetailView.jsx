import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, Disc, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useFlowStore } from '../store/useFlowStore';

/**
 * ProductDetailView — Detalle Completo del Producto en Pantalla Completa (Sección 5.4)
 */
export default function ProductDetailView() {
  const { selectedProduct, volver } = useFlowStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  if (!selectedProduct) {
    return (
      <div className="text-center py-12">
        <p className="text-amber-200/60">No se ha seleccionado ningún producto.</p>
        <button onClick={volver} className="mt-4 glass-btn-primary rounded-full px-4 py-2 text-xs font-bold">
          Volver al Inicio
        </button>
      </div>
    );
  }

  const handleAgregar = () => {
    addToCart(selectedProduct, cantidad);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Botón Volver */}
      <button
        onClick={volver}
        className="glass-btn-primary rounded-full px-4 py-1.5 text-xs font-bold inline-flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Volver</span>
      </button>

      {/* Contenedor Principal del Detalle */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-amber-500/30 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Arte del Álbum */}
        <div className="md:col-span-5 relative aspect-square rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl">
          <img
            src={selectedProduct.imagen}
            alt={selectedProduct.nombre}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="rounded-full bg-black/80 backdrop-blur-md px-3.5 py-1 text-xs font-extrabold text-amber-300 uppercase tracking-widest border border-amber-400/30">
              {selectedProduct.formato}
            </span>
          </div>
        </div>

        {/* Especificaciones y Compra */}
        <div className="md:col-span-7 space-y-6">
          <div>
            <span className="font-script text-2xl font-bold text-pink-400 block">
              {selectedProduct.artista}
            </span>
            <h1 className="font-serif-poster text-3xl sm:text-5xl font-bold text-amber-100 leading-tight">
              {selectedProduct.nombre}
            </h1>
            <p className="mt-2 font-poster text-3xl font-black text-amber-400">
              ${selectedProduct.precio.toFixed(2)} MXN
            </p>
          </div>

          <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed">
            Edición masterizada para audiófilos exigentes. Fabricación en prensa de alta densidad para garantizar una respuesta dinámica en graves y agudos cristalinos. Incluye arte impreso original e inserto con letras de canciones.
          </p>

          <div className="space-y-4 pt-4 border-t border-amber-500/15">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-amber-200">Cantidad a comprar:</span>
              <div className="flex items-center rounded-full glass-input px-3 py-1">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="h-7 w-7 flex items-center justify-center rounded-full text-amber-300 hover:bg-white/10 font-bold"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-bold text-white">{cantidad}</span>
                <button
                  onClick={() => setCantidad(cantidad + 1)}
                  className="h-7 w-7 flex items-center justify-center rounded-full text-amber-300 hover:bg-white/10 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAgregar}
              disabled={agregado}
              className={`w-full sm:w-auto px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                agregado
                  ? 'bg-emerald-500 text-white shadow-lg'
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
                  <span>Agregar al Carrito (${(selectedProduct.precio * cantidad).toFixed(2)})</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 pt-2 text-xs text-amber-200/60">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Garantía de prensado sin defectos · Empaque reforzado antishock</span>
          </div>
        </div>
      </div>
    </div>
  );
}
