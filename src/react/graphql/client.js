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