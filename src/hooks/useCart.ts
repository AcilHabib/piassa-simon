import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

export type Product = {
  id: string;
  quantity: number;
  sellingPrice: number;
  designation: string;
};

interface CartStore {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  addOneQuantity: (id: string) => void;
  removeOneQuantity: (id: string) => void;
  setQuantity: ({id, quantity}: {id: string; quantity: number}) => void;
  clearCart: () => void;
  createOrder: () => void;
  viewOrder: (items: Product[]) => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      cart: [],
      addToCart: (product) => {
        const productExists = get().cart.find((p) => p.id === product.id);
        if (productExists) return get().addOneQuantity(product.id);
        set((state) => ({
          cart: [product, ...state.cart],
        }));
      },
      removeFromCart: (product) => {
        set((state) => ({
          cart: state.cart.filter((p) => p.id !== product.id),
        }));
      },
      addOneQuantity: (id) => {
        set((state) => ({
          cart: state.cart.map((p) => (p.id === id ? {...p, quantity: p.quantity + 1} : p)),
        }));
      },
      removeOneQuantity: (id) => {
        const product = get().cart.find((p) => p.id === id);
        if (!product) return;
        if (product.quantity <= 1) return get().removeFromCart(product);
        set((state) => ({
          cart: state.cart.map((p) => (p.id === id ? {...p, quantity: p.quantity - 1} : p)),
        }));
      },
      setQuantity: ({id, quantity}) => {
        set((state) => ({
          cart: state.cart.map((p) => (p.id === id ? {...p, quantity} : p)),
        }));
      },
      clearCart: () => {
        set(() => ({
          cart: [],
        }));
      },
      createOrder: () => {
        // const cart = get().cart
      },
      viewOrder: (items) => {
        // add items to cart
        set(() => ({
          cart: items,
        }));
      },
    }),

    {
      name: 'cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
