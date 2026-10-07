import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import {
  FaTruck,
  FaCreditCard,
  FaHeadset,
  FaArrowRight,
  FaAward,
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/products");
        setProducts(data || []);
      } catch (error) {
        console.error("Home fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scrollToCollection = () => {
    document.getElementById("featured-products")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const trustFeatures = [
    {
      icon: FaAward,
      title: "100% Authentic Scents",
      desc: "Guaranteed original concentrations direct from international perfumers.",
    },
    {
      icon: FaCreditCard,
      title: "Pakistani Online Payments",
      desc: "EasyPaisa, JazzCash, Direct Bank Transfer & Cash On Delivery accepted.",
    },
    {
      icon: FaTruck,
      title: "Nationwide Safe Express",
      desc: "Dispatched within 24 hours with custom thermal-cushioned packaging.",
    },
    {
      icon: FaHeadset,
      title: "Concierge Assistance",
      desc: "Instant customer support via WhatsApp & direct inquiry portal.",
    },
  ];

  const categories = [
    {
      name: "Men's Collection",
      tagline: "Bold, Smoky, Woody & Intense",
      path: "/men",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Women's Collection",
      tagline: "Floral, Sweet, Elegant & Alluring",
      path: "/women",
      image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Unisex Haute Parfumerie",
      tagline: "Balanced, Aquatic & Sophisticated",
      path: "/unisex",
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-black via-neutral-900 to-neutral-950 py-20 px-4 sm:px-6 lg:px-8 border-b border-amber-950/30">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-amber-500/20 border border-amber-500/30 px-4 py-1.5 rounded-full shadow-lg">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-amber-300 font-extrabold text-xs tracking-[3px] uppercase">
              The Art of Luxury Fragrance
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15]">
            Discover Your Signature
            <span className="block bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Olfactory Masterpiece
            </span>
          </h1>

          <p className="text-neutral-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Curated fragrances crafted with rare oud, delicate florals, and velvety woods.
            Designed for those who leave an unforgettable impression wherever they go.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/perfumes")}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold px-8 py-4 rounded-xl text-sm transition-all shadow-xl shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Explore All Perfumes</span>
              <FaArrowRight size={13} />
            </button>

            <button
              onClick={scrollToCollection}
              className="w-full sm:w-auto bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700 px-8 py-4 rounded-xl text-sm font-bold transition-all"
            >
              Featured Scents
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trustFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-neutral-900/95 backdrop-blur-md border border-neutral-800 hover:border-amber-500/40 p-6 rounded-2xl transition-all duration-300 shadow-xl group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                  <Icon />
                </div>
                <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Curated Collections by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-[3px] text-amber-400 uppercase">
            Curated Categories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Tailored For Every Persona
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.path}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] border border-neutral-800 shadow-2xl block"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 space-y-2">
                <span className="text-[11px] font-extrabold tracking-widest text-amber-400 uppercase">
                  Explore
                </span>
                <h3 className="text-2xl font-extrabold text-white group-hover:text-amber-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-300">
                  {cat.tagline}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>Shop Collection</span>
                  <FaArrowRight size={11} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Perfumes Section */}
      <section id="featured-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold tracking-[3px] text-amber-400 uppercase">
              Handpicked Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Featured Fragrances
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-xl">
              Our most coveted luxury scents, renowned for exceptional longevity and projection.
            </p>
          </div>

          <Link
            to="/perfumes"
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-bold text-xs uppercase tracking-wider transition hover:underline"
          >
            <span>View All ({products.length})</span>
            <FaArrowRight size={11} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="aspect-[3/4] bg-neutral-900 rounded-2xl animate-pulse border border-neutral-800"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <button
            onClick={() => navigate("/perfumes")}
            className="bg-white hover:bg-neutral-200 text-black font-extrabold px-10 py-4 rounded-xl text-sm transition shadow-xl"
          >
            View Complete Perfume Catalogue
          </button>
        </div>
      </section>

      {/* Luxury Brand Quote Banner */}
      <section className="bg-gradient-to-r from-amber-950/20 via-neutral-900 to-amber-950/20 border-y border-amber-950/40 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-amber-400 text-3xl font-serif">“</span>
          <p className="text-lg sm:text-2xl font-serif italic text-neutral-200 leading-relaxed">
            Perfume is the indispensable complement of the personality of women and men, the finishing touch on a dress, the scent of unforgettable moments.
          </p>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block pt-2">
            — The ScentAura Philosophy
          </span>
        </div>
      </section>
    </main>
  );
};

export default Home;