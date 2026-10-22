/**
 * Cliente GraphQL para FACC Music (pwii p2-6)
 * Realiza peticiones HTTP POST al servidor /graphql (Tema 7: Fetching)
 */
import { useAuthStore } from '../store/useAuthStore';

const API_BASE = import.meta.env.PUBLIC_API_URL || "http://localhost:8000";
const GRAPHQL_ENDPOINT = `${API_BASE}/graphql`;
const TOKEN_ENDPOINT = `${API_BASE}/token`;

// ws:// (o wss:// si el backend es https) para las Subscriptions
const WS_ENDPOINT = GRAPHQL_ENDPOINT.replace(/^http/, "ws");

export async function fetchGraphQL(query, variables = {}) {
  try {
    const token = useAuthStore.getState().token;
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error status: ${response.status}`);
    }

    const json = await response.json();
    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message || "Error devuelto por GraphQL");
    }

    return json.data;
  } catch (error) {
    console.error("Error en peticion GraphQL:", error);
    throw error;
  }
}

/**
 * Subscriptions GraphQL por WebSocket (protocolo graphql-transport-ws).
 * El navegador no deja mandar el header Authorization en un WebSocket,
 * por eso el token viaja en la URL (?token=); el backend lo lee en get_context.
 * Devuelve una función para cancelar la suscripción (úsala en el cleanup del useEffect).
 */
export function suscribir(query, { variables = {}, onData, onError } = {}) {
  const token = useAuthStore.getState().token;
  if (!token) return () => {};

  const url = `${WS_ENDPOINT}?token=${encodeURIComponent(token)}`;
  let ws;
  let cerrado = false;
  let reintento;

  const conectar = () => {
    ws = new WebSocket(url, "graphql-transport-ws");

    ws.onopen = () => ws.send(JSON.stringify({ type: "connection_init" }));

    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === "connection_ack") {
        ws.send(JSON.stringify({ id: "1", type: "subscribe", payload: { query, variables } }));
      } else if (msg.type === "ping") {
        ws.send(JSON.stringify({ type: "pong" }));
      } else if (msg.type === "next") {
        if (msg.payload?.errors?.length) onError?.(msg.payload.errors[0].message);
        else onData?.(msg.payload.data);
      } else if (msg.type === "error") {
        onError?.(msg.payload?.[0]?.message || "Error en la suscripción");
      }
    };

    // Si se corta la red o el servidor se reinicia, reintenta a los 3 s
    ws.onclose = () => {
      if (!cerrado) reintento = setTimeout(conectar, 3000);
    };
  };

  conectar();

  return () => {
    cerrado = true;
    clearTimeout(reintento);
    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ id: "1", type: "complete" }));
    ws.close();
  };
}

/**
 * Login vía OAuth2 Password Flow (endpoint REST /token, no GraphQL).
 * El spec OAuth2 exige application/x-www-form-urlencoded, no JSON,
 * y el campo se llama 'username' aunque aquí mandemos un correo.
 */
export async function loginOAuth2(email, password) {
  const body = new URLSearchParams();
  body.append("username", email);
  body.append("password", password);

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Correo o contraseña incorrectos");
  }
  return response.json(); // { access_token, token_type }
}

// Campos de un pedido. La query y la subscription usan EXACTAMENTE los mismos,
// así un pedido que llega en vivo se puede pintar igual que uno cargado al inicio.
const CAMPOS_PEDIDO = `
  id fecha total status metodoPago referenciaPago direccionEnvio
  usuario { nombre email }
  detalles { cantidad precioUnitario producto { nombre } }
`;

// Queries Predefinidas
export const QUERIES = {
  GET_CATEGORIAS: `
    query GetCategorias {
      categorias {
        id
        nombre
        descripcion
        imagen
      }
    }
  `,

  GET_PRODUCTOS: `
    query GetProductos($limit: Int, $offset: Int, $categoriaId: Int, $busqueda: String) {
      productos(limit: $limit, offset: $offset, categoriaId: $categoriaId, busqueda: $busqueda) {
        total
        productos {
          id
          nombre
          artista
          formato
          precio
          imagen
          stock
          destacado
          categoriaId
        }
      }
    }
  `,

  GET_PRODUCTO_BY_ID: `
    query GetProducto($id: Int!) {
      producto(id: $id) {
        id
        nombre
        artista
        formato
        precio
        imagen
        stock
        destacado
        categoriaId
        categoria {
          id
          nombre
        }
      }
    }
  `,

  ME: `
    query Me {
      me {
        id
        nombre
        email
        rol
      }
    }
  `,

  CONFIG_PAGOS: `
    query { configPagos { paypalClientId mpPublicKey moneda } }
  `,

  // Admin: el backend regresa TODOS los pedidos si el token es de un ADMIN
  HISTORIAL_PEDIDOS: `
    query {
      historialPedidos { ${CAMPOS_PEDIDO} }
    }
  `,

  // Admin: lista de usuarios registrados
  USUARIOS: `
    query { usuarios { id nombre email rol } }
  `,
};

// Subscriptions (solo ADMIN): el servidor las empuja cuando pasa algo
export const SUBSCRIPTIONS = {
  PEDIDO_ACTUALIZADO: `
    subscription { pedidoActualizado { ${CAMPOS_PEDIDO} } }
  `,
  STOCK_BAJO: `
    subscription { stockBajo { id nombre artista stock } }
  `,
};


// Mutations Predefinidas
export const MUTATIONS = {
  REGISTRAR_PEDIDO: `
    mutation RegistrarPedido($datos: PedidoInput!) {
      registrarPedido(datos: $datos) {
        id
        fecha
        total
        status
        direccionEnvio
        metodoPago
      }
    }
  `,

  // ---- Pagos ----
  CREAR_ORDEN_PAYPAL: `
    mutation ($pedidoId: Int!) { crearOrdenPaypal(pedidoId: $pedidoId) }
  `,
  CAPTURAR_PAGO_PAYPAL: `
    mutation ($pedidoId: Int!, $orderId: String!) {
      capturarPagoPaypal(pedidoId: $pedidoId, orderId: $orderId) {
        id fecha total status direccionEnvio metodoPago referenciaPago
      }
    }
  `,
  // Mercado Pago: el formulario de tarjeta (Card Payment Brick) manda sus datos y el backend cobra
  PAGAR_TARJETA_MERCADO_PAGO: `
    mutation ($pedidoId: Int!, $datos: JSON!) {
      pagarTarjetaMercadoPago(pedidoId: $pedidoId, datos: $datos) {
        id fecha total status direccionEnvio metodoPago referenciaPago
      }
    }
  `,

  // Mercado Pago Checkout Pro (redirección). Se conservan por compatibilidad con el backend;
  // el checkout actual usa el formulario de tarjeta de arriba.
  CREAR_PAGO_MERCADO_PAGO: `
    mutation ($pedidoId: Int!) { crearPagoMercadoPago(pedidoId: $pedidoId) }
  `,
  CONFIRMAR_PAGO_MERCADO_PAGO: `
    mutation ($pedidoId: Int!, $paymentId: String!) {
      confirmarPagoMercadoPago(pedidoId: $pedidoId, paymentId: $paymentId) {
        id fecha total status direccionEnvio metodoPago referenciaPago
      }
    }
  `,
  VERIFICAR_PAGO_MERCADO_PAGO: `
    mutation ($pedidoId: Int!) {
      verificarPagoMercadoPago(pedidoId: $pedidoId) {
        id fecha total status direccionEnvio metodoPago referenciaPago
      }
    }
  `,

  // ---- Admin ----
  REGISTRAR_PRODUCTO: `
    mutation ($input: ProductoInput!) { registrarProducto(input: $input) { id } }
  `,
  ACTUALIZAR_PRODUCTO: `
    mutation ($id: Int!, $input: ProductoInput!) { actualizarProducto(id: $id, input: $input) { id } }
  `,
  ELIMINAR_PRODUCTO: `
    mutation ($id: Int!) { eliminarProducto(id: $id) }
  `,
  CAMBIAR_STATUS_PEDIDO: `
    mutation ($id: Int!, $status: String!) { cambiarStatusPedido(id: $id, status: $status) { id status } }
  `,

  REGISTRO: `
    mutation Registro($datos: RegistroInput!) {
      registrarUsuario(datos: $datos) {
        id
        nombre
        email
        rol
      }
    }
  `,
};