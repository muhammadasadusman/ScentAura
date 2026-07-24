import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";


const Women = () => {

  const { search } = useContext(CartContext);
   const [products, setProducts] = useState([]);

  const womenProducts = products.filter(
    (product) =>
      product.category === "Women" &&
      product.name.toLowerCase().includes(search.toLowerCase())
  );


useEffect(() => {
  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchProducts();
}, []);

  return (
     <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">


      <h1 className="
        text-3xl
        sm:text-4xl
        font-bold
        text-center
        mb-10
      ">
        Women's Perfumes
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

  {womenProducts.length > 0 ? (

    womenProducts.map((product) => (

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
        Sorry! We couldn't find any Women's perfume matching "
        <span className="font-semibold">{search}</span>"
      </p>

    </div>

  )}

</div>


    </div>
</>
  );

};


export default Women;