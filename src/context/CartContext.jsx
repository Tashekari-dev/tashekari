import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

function getNumericPrice(price) {
  if (typeof price === "number") return price;

  return Number(String(price).replace(/[₹,\s]/g, "")) || 0;
}

function getSavedCart() {
  try {
    const savedCart = localStorage.getItem("tashekari-cart");

    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Unable to load cart:", error);
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getSavedCart);

  useEffect(() => {
    try {
      localStorage.setItem(
        "tashekari-cart",
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Unable to save cart:", error);
      toast.error("Unable to save your cart.");
    }
  }, [cartItems]);

  function addToCart(product) {
    if (!product?.id) {
      toast.error("Unable to add this product.");
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prevItems,
        {
          ...product,
          price: getNumericPrice(product.price),
          quantity: 1,
        },
      ];
    });

    toast.dismiss();
    toast.success(
      `${product.name || "Product"} added to cart.`
    );
  }

  function addMultipleToCart(products) {
    if (!Array.isArray(products) || products.length === 0) {
      toast.error("No products found to add.");
      return;
    }

    const validProducts = products.filter(
      (product) => product?.id
    );

    if (validProducts.length === 0) {
      toast.error("No valid products found.");
      return;
    }

    setCartItems((prevItems) => {
      const updatedCart = [...prevItems];

      validProducts.forEach((product) => {
        const quantity = Math.max(
          1,
          Number(product.quantity) || 1
        );

        const existingIndex = updatedCart.findIndex(
          (item) => item.id === product.id
        );

        if (existingIndex >= 0) {
          updatedCart[existingIndex] = {
            ...updatedCart[existingIndex],
            quantity:
              updatedCart[existingIndex].quantity + quantity,
          };
        } else {
          updatedCart.push({
            ...product,
            price: getNumericPrice(product.price),
            quantity,
          });
        }
      });

      return updatedCart;
    });

    toast.dismiss();
    toast.success("Order products added to cart.");
  }

  function increaseQuantity(id) {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseQuantity(id) {
    const selectedItem = cartItems.find(
      (item) => item.id === id
    );

    if (!selectedItem) {
      toast.error("Product not found in cart.");
      return;
    }

    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

    if (selectedItem.quantity === 1) {
      toast.dismiss();
      toast.success(
        `${selectedItem.name || "Product"} removed from cart.`
      );
    }
  }

  function removeFromCart(id) {
    const selectedItem = cartItems.find(
      (item) => item.id === id
    );

    if (!selectedItem) {
      toast.error("Product not found in cart.");
      return;
    }

    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );

    toast.dismiss();
    toast.success(
      `${selectedItem.name || "Product"} removed from cart.`
    );
  }

  function clearCart() {
    if (cartItems.length === 0) {
      toast.error("Your cart is already empty.");
      return;
    }

    setCartItems([]);
    toast.dismiss();
    toast.success("Cart cleared successfully.");
  }

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        getNumericPrice(item.price) * item.quantity,
      0
    );
  }, [cartItems]);

  const deliveryCharge = useMemo(() => {
    if (cartSubtotal === 0 || cartSubtotal >= 999) {
      return 0;
    }

    return 99;
  }, [cartSubtotal]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + deliveryCharge;
  }, [cartSubtotal, deliveryCharge]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        deliveryCharge,
        cartTotal,
        addToCart,
        addMultipleToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}