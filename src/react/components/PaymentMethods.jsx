import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { fetchGraphQL, QUERIES, MUTATIONS } from '../graphql/client';

/**
 * PaymentMethods — Botones de pago de un pedido YA creado (status PENDIENTE).
 * El monto nunca sale del front: el backend crea la orden con el total de la BD
 * y verifica con PayPal / Mercado Pago antes de marcar el pedido como PAGADO.
 */
export default function PaymentMethods({ pedido, onPagado }) {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);
  const [mpAbierto, setMpAbierto] = useState(false);
  const [verificando, setVerificando] = useState(false);

  useEffect(() => {
    fetchGraphQL(QUERIES.CONFIG_PAGOS)
      .then((d) => setConfig(d.configPagos))
      .catch(() => setError('No se pudo cargar la configuración de pagos.'));
  }, []);

  // ---- Mercado Pago: se abre en otra pestaña; al terminar, el cliente da "Ya pagué" ----
  const pagarConMercadoPago = async () => {
    setError(null);
    const pestana = window.open('', '_blank'); // se abre antes del await para que no la bloquee el navegador
    try {
      const d = await fetchGraphQL(MUTATIONS.CREAR_PAGO_MERCADO_PAGO, { pedidoId: pedido.id });
      if (pestana) pestana.location.href = d.crearPagoMercadoPago;
      else window.location.href = d.crearPagoMercadoPago;
      setMpAbierto(true);
    } catch (err) {
      if (pestana) pestana.close();
      setError(err.message);
    }
  };

  // El backend busca en Mercado Pago un pago aprobado de este pedido
  const verificarMercadoPago = async () => {
    setError(null);
    setVerificando(true);
    try {
      const d = await fetchGraphQL(MUTATIONS.VERIFICAR_PAGO_MERCADO_PAGO, { pedidoId: pedido.id });
      onPagado(d.verificarPagoMercadoPago);
    } catch (err) {
      setError(err.message);
    } finally {
      setVerificando(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-amber-200/80">
        Pedido <b className="text-amber-300">#{pedido.id}</b> por{' '}
        <b className="text-amber-300">${pedido.total.toFixed(2)} MXN</b> — pagar con {pedido.metodoPago}:
      </p>

      {pedido.metodoPago === 'PayPal' && !config && !error && (
        <p className="text-xs text-amber-200/60">Cargando PayPal...</p>
      )}

      {pedido.metodoPago === 'PayPal' && config && !config.paypalClientId && (
        <p className="text-xs text-rose-300">Falta PAYPAL_CLIENT_ID en back/.env</p>
      )}

      {pedido.metodoPago === 'PayPal' && config?.paypalClientId && (
        <div className="rounded-2xl bg-white p-3">
          <PayPalScriptProvider options={{ clientId: config.paypalClientId, currency: config.moneda, intent: 'capture' }}>
            <PayPalButtons
              style={{ layout: 'vertical', shape: 'pill' }}
              createOrder={async () => {
                const d = await fetchGraphQL(MUTATIONS.CREAR_ORDEN_PAYPAL, { pedidoId: pedido.id });
                return d.crearOrdenPaypal;
              }}
              onApprove={async (data) => {
                try {
                  const d = await fetchGraphQL(MUTATIONS.CAPTURAR_PAGO_PAYPAL, {
                    pedidoId: pedido.id,
                    orderId: data.orderID,
                  });
                  onPagado(d.capturarPagoPaypal);
                } catch (err) {
                  setError(err.message);
                }
              }}
              onCancel={() => setError('Cancelaste el pago en PayPal. Puedes intentarlo de nuevo.')}
              onError={(err) => setError(err?.message || 'Ocurrió un error con PayPal.')}
            />
          </PayPalScriptProvider>
        </div>
      )}

      {pedido.metodoPago === 'Mercado Pago' && (
        <div className="space-y-3">
          <button
            onClick={pagarConMercadoPago}
            className="w-full rounded-full py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#009EE3] hover:bg-[#0088c4] transition-colors"
          >
            {mpAbierto ? 'Abrir Mercado Pago otra vez' : 'Pagar con Mercado Pago'}
          </button>

          {mpAbierto && (
            <>
              <p className="text-[11px] text-amber-200/70">
                Se abrió Mercado Pago en otra pestaña. Cuando veas "¡Listo! Tu pago ya se acreditó", regresa aquí:
              </p>
              <button
                onClick={verificarMercadoPago}
                disabled={verificando}
                className="w-full glass-btn-pink rounded-full py-3 text-xs font-bold uppercase tracking-wider disabled:opacity-60"
              >
                {verificando ? 'Verificando con Mercado Pago...' : 'Ya pagué, verificar mi pago'}
              </button>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">{error}</div>
      )}
    </div>
  );
}
