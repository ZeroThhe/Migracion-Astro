import React from 'react';
import { CheckCircle2, Disc, Home, Receipt } from 'lucide-react';
import { useFlowStore } from '../store/useFlowStore';

/**
 * OrderSuccessView — Recibo / Confirmación de Pedido Registrado (Sección 5.2 & 7.2)
 */
export default function OrderSuccessView() {
  const { completedOrder, irAlHome } = useFlowStore();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-panel rounded-3xl p-8 sm:p-10 text-center border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-amber-950/20 to-rose-950/30 shadow-2xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mx-auto mb-4 border border-emerald-500/40">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <span className="font-script text-2xl font-bold text-pink-400 block">
          ¡Gracias por tu compra en FACC Music!
        </span>
        <h1 className="font-poster text-3xl sm:text-4xl font-black uppercase text-amber-300">
          Pedido Creado Exitosamente
        </h1>
        <p className="text-xs text-amber-200/70 mt-2 max-w-md mx-auto">
          Tu pago fue verificado con la pasarela, la orden quedó registrada y el stock se actualizó en la base de datos.
        </p>

        {completedOrder && (
          <div className="mt-8 glass-panel rounded-2xl p-6 text-left border border-amber-500/20 space-y-3 bg-black/40">
            <div className="flex items-center justify-between border-b border-amber-500/15 pb-2">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-amber-400" />
                <span className="font-poster text-xs font-bold uppercase text-amber-200">
                  Folio de Orden #{completedOrder.id}
                </span>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                {completedOrder.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-amber-200/50 block text-[10px]">Fecha de Registro</span>
                <span className="font-bold text-amber-100">{completedOrder.fecha}</span>
              </div>
              <div>
                <span className="text-amber-200/50 block text-[10px]">Método de Pago</span>
                <span className="font-bold text-amber-100">{completedOrder.metodoPago}</span>
              </div>
              {completedOrder.referenciaPago && (
                <div className="col-span-2">
                  <span className="text-amber-200/50 block text-[10px]">Referencia del pago</span>
                  <span className="font-bold text-amber-100 break-all">{completedOrder.referenciaPago}</span>
                </div>
              )}
              <div className="col-span-2">
                <span className="text-amber-200/50 block text-[10px]">Dirección de Envío</span>
                <span className="font-bold text-amber-100">{completedOrder.direccionEnvio}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-amber-500/15 flex justify-between items-center">
              <span className="font-poster text-xs font-bold text-amber-200 uppercase">Monto Total</span>
              <span className="font-poster text-xl font-black text-amber-300">
                ${completedOrder.total.toFixed(2)} MXN
              </span>
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={irAlHome}
            className="glass-btn-primary rounded-full px-8 py-3 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            <span>Volver a la Tienda</span>
          </button>
        </div>
      </div>
    </div>
  );
}
