import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { FaHeart, FaShoppingCart, FaStar, FaEye } from "react-icons/fa";
import { CartContext } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, wishlist } = useContext(CartContext);
  const navigate = useNavigate();

  const isWishlisted = wishlist?.some((item) => item._id === product._id);

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    addToWishlist(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        <span className="bg-black/80 backdrop-blur-md text-amber-400 font-semibold text-[11px] px-2.5 py-1 rounded-full border border-amber-500/30 shadow-sm">
          {product.category}
        </span>
      </div>

      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleAddToWishlist}
          title={isWishlisted ? "In Wishlist" : "Add to Wishlist"}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-white/90 text-gray-700 hover:text-red-500 hover:bg-white"
          }`}
        >
          <FaHeart size={14} className={isWishlisted ? "animate-pulse" : ""} />
        </button>
      </div>

      {/* Image Container with hover cross-fade */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {product.image2 && (
          <img
            src={product.image2}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Quick View Overlay on Desktop */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-black px-4 py-2 rounded-full font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <FaEye size={12} /> View Fragrance
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-gradient-to-b from-white to-neutral-50/50">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[11px] font-bold tracking-wider text-amber-700 uppercase">
              {product.brand || "ScentAura"}
            </span>

            <div className="flex items-center text-amber-500 text-xs gap-0.5">
              <FaStar size={11} className="fill-amber-400" />
              <span className="font-bold text-gray-700 text-xs">
                {product.rating || 5}.0
              </span>
            </div>
          </div>

          <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-amber-600 transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>

          <p className="text-gray-500 text-xs line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-medium">
              Price
            </span>
            <span className="font-extrabold text-gray-900 text-base sm:text-lg">
              Rs. {Number(product.price).toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 bg-black hover:bg-amber-500 text-white hover:text-black px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 shadow-sm hover:shadow-amber-500/25 active:scale-95"
          >
            <FaShoppingCart size={13} />
            <span className="hidden xs:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;