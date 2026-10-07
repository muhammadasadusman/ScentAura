import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import {
  FaBars,
  FaTimes,
  FaHeart,
  FaShoppingCart,
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaShieldAlt,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const { cart, wishlist, search, setSearch } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products");
        setProducts(data);
      } catch (error) {
        console.error("Navbar fetch error:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleSearchChange = (value) => {
    setSearch(value);
    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }
    const result = products.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase()) ||
      item.category.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(result.slice(0, 5));
  };

  const handleSelectSuggestion = (id) => {
    navigate(`/product/${id}`);
    setSuggestions([]);
    setSearch("");
    closeMenu();
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "All Perfumes", path: "/perfumes" },
    { label: "Men", path: "/men" },
    { label: "Women", path: "/women" },
    { label: "Unisex", path: "/unisex" },
    { label: "Concierge", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md text-white border-b border-amber-950/40 shadow-xl">
      {/* Top micro bar for luxury guarantee */}
      <div className="bg-gradient-to-r from-neutral-900 via-amber-950/30 to-neutral-900 text-center py-1.5 px-4 text-[11px] text-amber-300 tracking-widest uppercase border-b border-white/5">
        ✨ Free Shipping Across Pakistan • 100% Original Guaranteed • EasyPaisa, JazzCash & Bank Accepted
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group whitespace-nowrap"
          onClick={closeMenu}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center text-black font-black text-lg shadow-md group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
            ScentAura
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 font-medium text-sm tracking-wide">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-1 transition-colors duration-300 ${
                  isActive
                    ? "text-amber-400 font-semibold"
                    : "text-gray-300 hover:text-amber-300"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full animate-fadeIn" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions (Search, Wishlist, Cart, Profile) */}
        <div className="hidden lg:flex items-center gap-5">
          {/* Search Box */}
          <div className="relative">
            <div
              className={`flex items-center bg-neutral-900/90 border rounded-full px-3.5 py-1.5 w-52 xl:w-64 transition-all duration-300 ${
                searchFocused
                  ? "border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500"
                  : "border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <FaSearch className="text-gray-400 mr-2.5 text-xs" />
              <input
                type="text"
                placeholder="Search luxury scents..."
                value={search}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate("/perfumes");
                    setSuggestions([]);
                  }
                }}
                className="w-full bg-transparent outline-none text-white text-xs placeholder-gray-500"
              />
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && searchFocused && (
              <div className="absolute top-12 left-0 w-72 bg-neutral-900 text-white border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-neutral-800">
                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    onMouseDown={() => handleSelectSuggestion(item._id)}
                    className="p-3 hover:bg-neutral-800/80 cursor-pointer flex items-center gap-3 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg border border-neutral-700"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-gray-200">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-amber-400 font-medium">
                        Rs. {Number(item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="relative p-2 text-gray-300 hover:text-amber-400 transition-colors"
            title="Wishlist"
          >
            <FaHeart size={19} />
            {wishlist?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2 text-gray-300 hover:text-amber-400 transition-colors"
            title="Cart"
          >
            <FaShoppingCart size={19} />
            {cart?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Admin Dashboard Pill */}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold text-xs px-3.5 py-2 rounded-full transition-all shadow-md"
            >
              <FaShieldAlt size={12} />
              Admin
            </Link>
          )}

          {/* Auth Button / Profile */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full text-xs text-gray-300">
                <FaUser className="text-amber-400" size={11} />
                <span className="max-w-[100px] truncate font-medium">
                  {user.name}
                </span>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <FaSignOutAlt size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-amber-400 hover:bg-amber-500 text-black font-bold text-xs tracking-wide px-4 py-2 rounded-full transition-all shadow-md hover:shadow-amber-500/20"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Actions & Hamburger */}
        <div className="flex lg:hidden items-center gap-3">
          <Link to="/wishlist" className="relative p-1 text-gray-300">
            <FaHeart size={18} />
            {wishlist?.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative p-1 text-gray-300">
            <FaShoppingCart size={18} />
            {cart?.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-gray-300 hover:text-amber-400"
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-neutral-950 border-t border-neutral-800 p-5 space-y-4">
          {/* Mobile Search */}
          <div className="relative">
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search perfumes..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate("/perfumes");
                    closeMenu();
                  }
                }}
                className="w-full bg-transparent outline-none text-white text-sm"
              />
            </div>

            {suggestions.length > 0 && (
              <div className="mt-2 bg-neutral-900 border border-neutral-800 rounded-xl p-2 space-y-1">
                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSelectSuggestion(item._id)}
                    className="p-2 text-sm text-gray-200 hover:bg-neutral-800 rounded-lg cursor-pointer"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className="py-2 px-3 rounded-lg text-sm text-gray-200 hover:bg-neutral-900 hover:text-amber-400 transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-neutral-800 flex flex-col gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className="w-full bg-amber-500 text-black text-center font-bold py-2.5 rounded-xl text-sm"
              >
                Admin Dashboard
              </Link>
            )}

            {user ? (
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="w-full bg-red-600/90 text-white font-bold py-2.5 rounded-xl text-sm"
              >
                Logout ({user.name})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="w-full bg-white text-black text-center font-bold py-2.5 rounded-xl text-sm"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;