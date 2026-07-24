import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Wishlist = () => {

  const {
    wishlist,
    addToCart,
    removeFromWishlist
  } = useContext(CartContext);

  if (wishlist.length === 0) {
  return (
    <div
      className="
      flex
      flex-col
      items-center
      justify-center
      py-20
      px-4
      text-center
      "
    >

      <div className="text-7xl mb-5">
        ❤️
      </div>


      <h1
        className="
        text-3xl
        sm:text-4xl
        font-bold
        mb-4
        "
      >
        Your Wishlist is Empty
      </h1>


      <p
        className="
        text-gray-500
        max-w-md
        mb-8
        "
      >
        Save your favourite perfumes here and
        shop them anytime. Discover your perfect
        signature fragrance.
      </p>


      <button
        onClick={() => window.location.href="/perfumes"}
        className="
        bg-yellow-500
        hover:bg-yellow-600
        text-black
        font-semibold
        px-8
        py-3
        rounded-lg
        transition
        "
      >
        Explore Perfumes
      </button>


    </div>
  );
}

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <h1 className="text-4xl font-bold text-center mb-10">
        My Wishlist ❤️
      </h1>

      <div className="space-y-6">

        {wishlist.map((item) => (

          <div
            key={item._id}
            className="
            bg-white
            shadow-lg
            rounded-xl
            p-5
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-5
            "
          >

            <div className="flex items-center gap-5">

              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-28 rounded-lg object-cover"
              />

              <div>

                <h2 className="text-xl font-bold">
                  {item.name}
                </h2>

                <p className="text-gray-500">
                  {item.category}
                </p>

                <div className="text-yellow-500 mt-2">
                  {"⭐".repeat(item.rating)}
                </div>

                <p className="text-yellow-600 font-bold mt-2">
                  Rs. {item.price}
                </p>

              </div>

            </div>

            <div className="flex gap-3">

              <button
                onClick={() => {
                 addToCart(item);
               removeFromWishlist(item._id);
                  }}
                className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
              >
                Move To Cart
              </button>

              <button
                onClick={() => removeFromWishlist(item._id)}
                className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
              >
                Remove
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Wishlist;