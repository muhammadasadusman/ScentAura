import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

const CartProvider = ({ children }) => {

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
  const savedWishlist = localStorage.getItem("wishlist");
  return savedWishlist ? JSON.parse(savedWishlist) : [];
});

  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


useEffect(() => {
  localStorage.setItem(
    "wishlist",
    JSON.stringify(wishlist)
  );
}, [wishlist]);



  const addToCart = (product) => {
    setCart((prev) => {

      const exist = prev.find(
  (item) => item._id === product._id
);

      if (exist) {
        toast.info(`${product.name} quantity increased 🛒`);
        return prev.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      toast.success(`${product.name} Added to Cart 🛒`);

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (_id) => {
  setCart((prev) =>
    prev.filter((item) => item._id !== _id)
  );
};

  const increaseQty = (_id) => {
  setCart((prev) =>
    prev.map((item) =>
      item._id === _id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  
const decreaseQty = (_id) => {
  setCart((prev) =>
    prev.map((item) =>
      item._id === _id && item.quantity > 1
        ? {
            ...item,
            quantity: item.quantity - 1,
          }
        : item
    )
  );
};

const clearCart = () => {
  setCart([]);
};


const addToWishlist = (product) => {
  setWishlist((prev) => {

    const exist = prev.find(
  (item) => item._id === product._id
);


    if (exist) {
      toast.info("Already in Wishlist ❤️");
      return prev;
    }


    toast.success(`${product.name} Added to Wishlist ❤️`);

    return [...prev, product];

  });
};
  

  const removeFromWishlist = (_id) => {
  setWishlist((prev) =>
    prev.filter((item) => item._id !== _id)
  );
};

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        search,
        clearCart,
        setSearch,
        addToCart,
        addToWishlist,
        removeFromWishlist,
        removeFromCart,
        increaseQty,
        decreaseQty,
        
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;