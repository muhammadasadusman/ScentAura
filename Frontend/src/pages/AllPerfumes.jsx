import { useContext,useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import API from "../services/api";
import ProductCard from "../components/ProductCard";


const AllPerfumes = () => {
const { search } = useContext(CartContext);
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {

  const fetchProducts = async () => {
  try {
    const { data } = await API.get("/products");
    console.log("Backend Products:", data);

    setProducts(data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  fetchProducts();

}, []);


const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(search.toLowerCase())
);

  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">


      <h1 className="
        text-3xl
        sm:text-4xl
        font-bold
        text-center
        mb-10
      ">
        All Perfumes
      </h1>



     <div
  className="
  grid
  grid-cols-2
  sm:grid-cols-3
  lg:grid-cols-4
  gap-6
  sm:gap-8
  "
>
 {loading ? (
  <div className="col-span-full text-center py-16">
    <h2 className="text-2xl font-bold text-gray-700">
      Loading...
    </h2>
  </div>
) : filteredProducts.length > 0 ? (
  filteredProducts.map((product) => (
    <ProductCard
      key={product._id}
      product={product}
    />
  ))
) : (
  <div className="col-span-full text-center py-16">
    <h2 className="text-3xl font-bold text-red-500">
      No Products Found
    </h2>

    <p className="text-gray-500 mt-3">
      Sorry! We couldn't find any perfume matching "
      <span className="font-semibold">{search}</span>"
    </p>
  </div>
)}

</div>


    </div>

  );

};


export default AllPerfumes;