import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';

export const VIEWS = {
  HOME: 'HOME',
  CATEGORY_DETAIL: 'CATEGORY_DETAIL',
  PRODUCT_DETAIL: 'PRODUCT_DETAIL',
  CART: 'CART',
  CHECKOUT: 'CHECKOUT',
  ORDER_SUCCESS: 'ORDER_SUCCESS',
  LOGIN: 'LOGIN',
};

/**
 * Máquina de Estados de Navegación del E-commerce (Sin URLs) (Sección 5.2)
 * Controla el recorrido del usuario mediante estado y eventos.
 */
export const useFlowStore = create((set, get) => ({
  currentView: VIEWS.HOME,
  history: [VIEWS.HOME],
  selectedCategory: null,
  selectedProduct: null,
  completedOrder: null,
  quickViewProduct: null, // Para el Portal Modal (Tema 15)
  viewAfterLogin: null,   // A qué vista regresar tras iniciar sesión

  elegirCategoria: (categoria) => {
    set({
      currentView: VIEWS.CATEGORY_DETAIL,
      history: [...get().history, VIEWS.CATEGORY_DETAIL],
      selectedCategory: categoria,
    });
  },

  verProducto: (producto) => {
    set({
      currentView: VIEWS.PRODUCT_DETAIL,
      history: [...get().history, VIEWS.PRODUCT_DETAIL],
      selectedProduct: producto,
    });
  },

  abrirModalProducto: (producto) => {
    set({ quickViewProduct: producto });
  },

  cerrarModalProducto: () => {
    set({ quickViewProduct: null });
  },

  irAlCarrito: () => {
    set({
      currentView: VIEWS.CART,
      history: [...get().history, VIEWS.CART],
    });
  },

  // Evento: Ir a Login (guarda a qué vista regresar después)
  irALogin: (destino = null) => {
    set({
      currentView: VIEWS.LOGIN,
      history: [...get().history, VIEWS.LOGIN],
      viewAfterLogin: destino,
    });
  },

  // Evento: Login/registro exitoso
  loginExitoso: () => {
    const destino = get().viewAfterLogin || VIEWS.HOME;
    set({
      currentView: destino,
      history: destino === VIEWS.HOME ? [VIEWS.HOME] : [VIEWS.HOME, destino],
      viewAfterLogin: null,
    });
  },

  // Evento: Finalizar Compra -> Checkout (exige sesión)
  finalizarCompra: () => {
    if (!useAuthStore.getState().token) {
      get().irALogin(VIEWS.CHECKOUT);
      return;
    }
    set({
      currentView: VIEWS.CHECKOUT,
      history: [...get().history, VIEWS.CHECKOUT],
    });
  },

  pedidoCreado: (orden) => {
    set({
      currentView: VIEWS.ORDER_SUCCESS,
      history: [VIEWS.HOME, VIEWS.ORDER_SUCCESS],
      completedOrder: orden,
    });
  },

  irAlHome: () => {
    set({
      currentView: VIEWS.HOME,
      history: [VIEWS.HOME],
      selectedCategory: null,
      selectedProduct: null,
    });
  },

  volver: () => {
    const history = [...get().history];
    if (history.length > 1) {
      history.pop();
      const prevView = history[history.length - 1];
      set({ currentView: prevView, history });
    } else {
      set({ currentView: VIEWS.HOME, history: [VIEWS.HOME] });
    }
  },
}));