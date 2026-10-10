/**
 * Cliente GraphQL para FACC Music (pwii p2-6)
 * Realiza peticiones HTTP POST al servidor /graphql (Tema 7: Fetching)
 */
import { useAuthStore } from '../store/useAuthStore';

const API_BASE = import.meta.env.PUBLIC_API_URL || "http://localhost:8000";
const GRAPHQL_ENDPOINT = `${API_BASE}/graphql`;
const TOKEN_ENDPOINT = `${API_BASE}/token`;

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
    console.error("❌ Error en petición GraphQL:", error);
    throw error;
  }
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
    query { configPagos { paypalClientId moneda } }
  `,

  // Admin: el backend regresa TODOS los pedidos si el token es de un ADMIN
  HISTORIAL_PEDIDOS: `
    query {
      historialPedidos {
        id fecha total status metodoPago referenciaPago direccionEnvio
        usuario { nombre email }
        detalles { cantidad precioUnitario producto { nombre } }
      }
    }
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