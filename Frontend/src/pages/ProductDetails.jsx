import { useParams,useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import API from "../services/api";
import { CartContext } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {

const { id } = useParams();
const navigate = useNavigate();

const { addToCart, addToWishlist } = useContext(CartContext);

const [product, setProduct] = useState(null);
const [relatedProducts, setRelatedProducts] = useState([]);

useEffect(() => {

  const fetchProduct = async () => {
    try {

      const { data } = await API.get(`/products/${id}`);

      setProduct(data);

      const { data: allProducts } = await API.get("/products");

const related = allProducts
  .filter(
    (item) =>
      item.category === data.category &&
      item._id !== data._id
  )
  .slice(0, 4);

setRelatedProducts(related);

    } catch (error) {
      console.log(error);
    }
  };


  fetchProduct();

}, [id]);


  if (!product) {
    return (
      <h1 className="text-center text-3xl py-20">
        Product Not Found
      </h1>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-5 py-10">


      {/* Main Product */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">


        {/* Image */}

        <div className="h-[500px] rounded-xl overflow-hidden bg-gray-200">

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />

        </div>



        {/* Details */}

        <div className="flex flex-col justify-center">


          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>


          <div className="mt-4 text-yellow-500 text-xl">
            {"⭐".repeat(product.rating)}
          </div>


          <p className="text-2xl font-bold text-yellow-600 mt-5">
            Rs. {product.price}
          </p>


          <p className="text-gray-600 mt-5 leading-7">
            {product.description}
          </p>



          <div className="flex gap-5 mt-8">


            <button
  onClick={() => {
    addToCart(product);
    navigate("/cart");
  }}
  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
>
  Add To Cart
</button>


            <button
  onClick={() => {
    addToWishlist(product);
    navigate("/wishlist");
  }}
  className="border border-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition"
>
  Add Wishlist ❤️
</button>


          </div>


        </div>


      </div>


      {/* Related Products */}

              <div className="mt-20">

  <h2 className="text-3xl font-bold mb-8">
    Related Perfumes
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

    {relatedProducts.map((item) => (
      <ProductCard
        key={item._id}
        product={item}
      />
    ))}

  </div>

</div>


    </div>
  );
};


export default ProductDetails;