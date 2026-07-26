import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

const WishlistContext = createContext();

function getSavedWishlist() {
  try {
    const savedWishlist = localStorage.getItem(
      "tashekari-wishlist"
    );

    return savedWishlist ? JSON.parse(savedWishlist) : [];
  } catch (error) {
    console.error("Unable to load wishlist:", error);
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] =
    useState(getSavedWishlist);

  useEffect(() => {
    try {
      localStorage.setItem(
        "tashekari-wishlist",
        JSON.stringify(wishlistItems)
      );
    } catch (error) {
      console.error("Unable to save wishlist:", error);

      toast.dismiss();
      toast.error("Unable to save your wishlist.");
    }
  }, [wishlistItems]);

  function addToWishlist(product) {
    if (!product?.id) {
      toast.dismiss();
      toast.error("Unable to add this product.");
      return;
    }

    const alreadyExists = wishlistItems.some(
      (item) => item.id === product.id
    );

    if (alreadyExists) {
      toast.dismiss();
      toast.error("Product is already in your wishlist.");
      return;
    }

    setWishlistItems((currentItems) => [
      ...currentItems,
      product,
    ]);

    toast.dismiss();
    toast.success(
      `${product.name || "Product"} added to wishlist.`
    );
  }

  function removeFromWishlist(id) {
    const selectedItem = wishlistItems.find(
      (item) => item.id === id
    );

    if (!selectedItem) {
      toast.dismiss();
      toast.error("Product not found in wishlist.");
      return;
    }

    setWishlistItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );

    toast.dismiss();
    toast.success(
      `${selectedItem.name || "Product"} removed from wishlist.`
    );
  }

  function toggleWishlist(product) {
    if (!product?.id) {
      toast.dismiss();
      toast.error("Unable to update wishlist.");
      return;
    }

    const alreadyExists = wishlistItems.some(
      (item) => item.id === product.id
    );

    if (alreadyExists) {
      setWishlistItems((currentItems) =>
        currentItems.filter(
          (item) => item.id !== product.id
        )
      );

      toast.dismiss();
      toast.success(
        `${product.name || "Product"} removed from wishlist.`
      );

      return;
    }

    setWishlistItems((currentItems) => [
      ...currentItems,
      product,
    ]);

    toast.dismiss();
    toast.success(
      `${product.name || "Product"} added to wishlist.`
    );
  }

  function isInWishlist(id) {
    return wishlistItems.some((item) => item.id === id);
  }

  function clearWishlist() {
    if (wishlistItems.length === 0) {
      toast.dismiss();
      toast.error("Your wishlist is already empty.");
      return;
    }

    setWishlistItems([]);

    toast.dismiss();
    toast.success("Wishlist cleared successfully.");
  }

  const wishlistCount = useMemo(
    () => wishlistItems.length,
    [wishlistItems]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}