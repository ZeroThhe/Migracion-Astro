import { create } from 'zustand';

/**
 * Tienda Zustand Global para la Gestión del Carrito (Tema 11)
 * Evita el Prop Drilling (Tema 6) permitiendo a cualquier componente acceder al estado del carrito.
 */
export const useCartStore = create((set, get) => ({
  cartItems: [],

  // Agregar un producto al carrito
  addToCart: (producto, cantidad = 1) => {
    set((state) => {
      const existingIndex = state.cartItems.findIndex((item) => item.producto.id === producto.id);
      if (existingIndex >= 0) {
        const updated = [...state.cartItems];
        updated[existingIndex].cantidad += cantidad;
        return { cartItems: updated };
      } else {
        return { cartItems: [...state.cartItems, { producto, cantidad }] };
      }
    });
  },

  // Modificar cantidad de un producto en el carrito
  updateQuantity: (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      get().removeFromCart(productoId);
      return;
    }
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.producto.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
      ),
    }));
  },

  // Eliminar un producto del carrito
  removeFromCart: (productoId) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.producto.id !== productoId),
    }));
  },

  // Vaciar carrito
  clearCart: () => set({ cartItems: [] }),

  // Cómputo del total de items
  getTotalItems: () => {
    return get().cartItems.reduce((acc, item) => acc + item.cantidad, 0);
  },

  // Cómputo del precio total de la compra
  getTotalPrice: () => {
    return get().cartItems.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
  },
}));
