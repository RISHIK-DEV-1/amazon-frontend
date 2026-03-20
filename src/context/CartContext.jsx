import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {

  const [cart, setCart] = useState(() => {

    try {
      const stored = localStorage.getItem("cart");

      if (!stored) return [];

      const parsed = JSON.parse(stored);

      return Array.isArray(parsed) ? parsed : [];

    } catch {
      return [];
    }

  });


  // -------- SAVE CART --------

  useEffect(() => {

    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {}

  }, [cart]);


  // -------- HELPERS --------

  const isInCart = (id) => {
    return cart.some((item) => item.id === id);
  };


  const addToCart = (product) => {

    setCart((prev) => {

      const exists = prev.find((item) => item.id === product.id);

      if (exists) return prev;

      return [...prev, { ...product, quantity: product.quantity || 1 }];

    });

  };


  const increaseQty = (id) => {

    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );

  };


  const decreaseQty = (id) => {

    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

  };


  const removeFromCart = (id) => {

    setCart((prev) => prev.filter((item) => item.id !== id));

  };


  return (

    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        isInCart,
      }}
    >

      {children}

    </CartContext.Provider>

  );

}
