import React from 'react';
import { ShoppingBag, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useFlowStore } from '../store/useFlowStore';

/**
 * ContextBar — Zona de Contexto del Layout (Sección 5.3)
 * Muestra promociones activas, vista previa del carrito o avisos dinámicos.
 */
export default function ContextBar() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const { irAlCarrito, currentView } = useFlowStore();

  if (currentView === 'CART' || currentView === 'CHECKOUT') return null;

  return (
    <div className="my-6 glass-panel rounded-2xl p-4 border border-amber-500/20 bg-gradient-to-r from-amber-950/30 via-amber-900/20 to-rose-950/30 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
          <Tag className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-amber-200">
             Promoción de Envío Gratis: <span className="text-pink-400">En compras mayores a $800.00 MXN</span>
          </p>
          <p className="text-[11px] text-amber-200/60">
            Todos los álbumes se envían empaquetados en caja rígida protectora.
          </p>
        </div>
      </div>

      {totalItems > 0 && (
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-amber-500/30">
          <div className="text-right">
            <span className="text-[10px] text-amber-200/60 block">Carrito Activo ({totalItems} items)</span>
            <span className="font-poster text-sm font-extrabold text-amber-300">
              ${totalPrice.toFixed(2)} MXN
            </span>
          </div>
          <button
            onClick={irAlCarrito}
            className="glass-btn-primary rounded-full p-2 text-slate-950 hover:scale-105 transition-transform"
            title="Ir al Carrito"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
