import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// Cart is stored in localStorage so it survives page refreshes.
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rb_cart')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('rb_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product === product._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        },
      ];
    });
  };

  // "Buy now" replaces the cart with this one item and moves to checkout.
  const buyNow = (product, quantity = 1) => {
    setCart([
      {
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      },
    ]);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.product !== productId));
  };

  const changeQuantity = (productId, delta) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.product === productId) {
          const q = i.quantity + delta;
          return q < 1 ? i : { ...i, quantity: q };
        }
        return i;
      })
    );
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, buyNow, removeFromCart, changeQuantity, clearCart, subtotal, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
