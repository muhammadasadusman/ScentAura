import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { TypeAnimation } from "react-type-animation";


const Home = () => {
  const navigate = useNavigate();
 const [products, setProducts] = useState([]);

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



  const scrollToCollection = () => {
    document.getElementById("featured-products")?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
        
    <>
       

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-r from-black via-gray-900 to-black text-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-28">
            <div className="max-w-3xl">
              <p className="text-yellow-500 text-sm sm:text-base font-semibold uppercase tracking-[4px]">
                Luxury Fragrances
              </p>

              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                Discover Your
                <span className="text-yellow-500"> Signature </span>
                Scent
              </h1>

              <p className="mt-6 text-gray-300 text-base sm:text-lg leading-8">
                Explore premium perfumes for Men, Women and Unisex collections.
                Find long-lasting fragrances from the world's most loved brands.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
              onClick={() => navigate("/perfumes")}
              className="bg-yellow-500 hover:bg-yellow-600 transition duration-300 text-black font-semibold px-8 py-3 rounded-lg"
                >
            Shop Now
               </button>

                    <button
                    onClick={scrollToCollection}
                    className="border border-white hover:bg-white hover:text-black transition duration-300 px-8 py-3 rounded-lg"
                   >
                Explore Collection
              </button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Section */}
        <section
         id="featured-products"
        className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16">
          <div className="text-center">
            <TypeAnimation
          sequence={[
         "Featured Perfumes",
  ]}
  wrapper="h2"
  speed={50}
  cursor={false}
  className="text-3xl sm:text-4xl font-bold text-gray-900"
/>

         <TypeAnimation
  sequence={[
    1000,
    "Luxury fragrances crafted for every personality. Discover premium perfumes with long-lasting freshness and elegance.",
  ]}
  wrapper="p"
  speed={70}
  cursor={false}
  className="text-gray-600 mt-4 max-w-2xl mx-auto"
/>   

          </div>

          <div
  className="
    grid
    grid-cols-2
    sm:grid-cols-3
    lg:grid-cols-4
    gap-6
    sm:gap-8
    mt-12
  "
>
  {products.slice(0, 4).map((product) => (
    <ProductCard
      key={product.id}
      product={product}
        />
        ))}
        </div>

<div className="text-center mt-10">
  <button
    onClick={() => navigate("/perfumes")}
    className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg transition"
  >
    View All Perfumes
  </button>
</div>

        </section>
      </main>
    </>
  );
};

export default Home;