import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

import { CartContext } from "../context/CartContext";


const ProductCard = ({ product }) => {


  const { addToCart, addToWishlist } = useContext(CartContext);

  const navigate = useNavigate();



  return (

    <div
     onClick={() => navigate(`/product/${product._id}`)}
      className="
  bg-white
  rounded-xl
  shadow-md
  overflow-hidden
  hover:shadow-2xl
  transition
  duration-300
  w-full
  cursor-pointer
  group
      "
    >


      {/* Product Image */}

     <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">

  <img
    src={product.image}
    alt={product.name}
    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:opacity-0 group-hover:scale-105"
  />


 {product.image2 && (
  <img
    src={product.image2}
    alt={product.name}
    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
  />
)}

</div>



      {/* Product Info */}

      <div className="p-4 sm:p-5">


        <h2
         className="
  text-lg
  sm:text-xl
  font-semibold
  text-red-600
  hover:text-red-800
  transition-colors
  duration-300
  truncate
  "
        >
          {product.name}
        </h2>



        <p className="text-gray-500 text-sm mt-1">
          {product.category}
        </p>



        <div className="text-yellow-500 mt-2 text-sm sm:text-base">
          {"⭐".repeat(product.rating)}
        </div>



        <p
          className="
          text-yellow-600
          font-bold
          text-lg
          sm:text-xl
          mt-3
          "
        >
          Rs. {product.price}
        </p>



        {/* Buttons */}

        <div
          className="
           grid
         grid-cols-3
             gap-1
          sm:gap-2
          mt-5
          "
        >


          <Link
            to={`/product/${product._id}`}
            className="
            bg-black
            text-white
            text-center
            py-2
           rounded-lg
            text-xs
           sm:text-sm
          md:text-base
           whitespace-nowrap
            hover:bg-gray-800
            "
          >
            View
          </Link>


<button
  onClick={() => {
    addToCart(product);
    navigate("/cart");
  }}
  className="
  bg-yellow-500
  flex
  justify-center
  items-center
  rounded-lg
  hover:bg-yellow-600
  "
>
  <FaShoppingCart />
</button>
          


          <button
  onClick={() => {
    addToWishlist(product);
    navigate("/wishlist");
  }}
  className="
  border
  flex
  justify-center
  items-center
  rounded-lg
  hover:bg-black
  hover:text-white
  transition
  "
>
  <FaHeart />
</button>


        </div>


      </div>


    </div>

  );

};


export default ProductCard;