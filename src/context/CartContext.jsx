import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  const [selectedItems, setSelectedItems] = useState([]);

  const [orderedItems, setOrderedItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ordered")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("ordered", JSON.stringify(orderedItems));
  }, [orderedItems]);

  const isInCart = (id) => cart.some((item) => item.id === id);
  const isOrdered = (id) => orderedItems.includes(id);

  // ADD TO CART
  const addToCart = (product) => {
    setCart((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev;
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  // QUANTITY
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // REMOVE
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));

    // also remove from selected
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ FIX: STORE FULL PRODUCT
  const toggleSelect = (product) => {
    setSelectedItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);

      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product]; // ✅ FULL OBJECT
      }
    });
  };

  const isSelected = (id) =>
    selectedItems.some((item) => item.id === id);

  const clearSelected = () => setSelectedItems([]);

  const clearCart = () => setCart([]);

  const markOrdered = (items) => {
    const ids = items.map((i) => i.id);
    setOrderedItems((prev) => [...new Set([...prev, ...ids])]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        selectedItems,
        toggleSelect,
        isSelected,
        clearSelected,

        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,

        isInCart,
        markOrdered,
        isOrdered,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
