import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import { fetchGraphQL, QUERIES, MUTATIONS } from '../graphql/client';

/**
 * PaymentMethods — Pago de un pedido YA creado (status PENDIENTE), todo dentro de la página.
 * - PayPal: botones del SDK (ventana sobre el sitio o formulario de tarjeta en línea).
 * - Mercado Pago: Card Payment Brick (formulario de tarjeta incrustado, sin redirección).
 * El monto nunca sale del front: el backend cobra el total de la BD y verifica el pago.
 */

// Mercado Pago solo debe inicializarse una vez por página
let mpInicializado = false;

export default function PaymentMethods({ pedido, onPagado }) {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);

  // Guardamos onPagado en una ref para que el formulario de Mercado Pago no se vuelva a dibujar
  const onPagadoRef = useRef(onPagado);
  onPagadoRef.current = onPagado;

  useEffect(() => {
    fetchGraphQL(QUERIES.CONFIG_PAGOS)
      .then((d) => {
        // Mercado Pago se inicializa con la llave PÚBLICA antes de dibujar el formulario
        if (d.configPagos.mpPublicKey && !mpInicializado) {
          initMercadoPago(d.configPagos.mpPublicKey, { locale: 'es-MX' });
          mpInicializado = true;
        }
        setConfig(d.configPagos);
      })
      .catch(() => setError('No se pudo cargar la configuración de pagos. Revisa que el backend esté encendido.'));
  }, []);

  // ---- Mercado Pago ----
  // useMemo / useCallback: si estas props cambian en cada render, el formulario se reinicia y se borra lo escrito
  const mpInicializacion = useMemo(() => ({ amount: pedido.total }), [pedido.total]);

  const pagarConTarjeta = useCallback(async (formData) => {
    setError(null);
    try {
      const d = await fetchGraphQL(MUTATIONS.PAGAR_TARJETA_MERCADO_PAGO, {
        pedidoId: pedido.id,
        datos: formData,
      });
      onPagadoRef.current(d.pagarTarjetaMercadoPago);
    } catch (err) {
      setError(err.message);
      throw err; // le avisa al formulario que falló para que se pueda reintentar
    }
  }, [pedido.id]);

  const errorFormularioMP = useCallback((err) => {
    console.error('Error en el formulario de Mercado Pago:', err);
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-xs text-amber-200/80">
        Pedido <b className="text-amber-300">#{pedido.id}</b> por{' '}
        <b className="text-amber-300">${pedido.total.toFixed(2)} MXN</b> — pagar con {pedido.metodoPago}:
      </p>

      {!config && !error && (
        <p className="text-xs text-amber-200/60">Cargando método de pago...</p>
      )}

      {/* ================= PAYPAL ================= */}
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

      {/* ================= MERCADO PAGO ================= */}
      {pedido.metodoPago === 'Mercado Pago' && config && !config.mpPublicKey && (
        <p className="text-xs text-rose-300">Falta MP_PUBLIC_KEY en back/.env</p>
      )}

      {pedido.metodoPago === 'Mercado Pago' && config?.mpPublicKey && (
        <div className="rounded-2xl bg-white p-3">
          <CardPayment
            initialization={mpInicializacion}
            onSubmit={pagarConTarjeta}
            onError={errorFormularioMP}
          />
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">{error}</div>
      )}
    </div>
  );
}
