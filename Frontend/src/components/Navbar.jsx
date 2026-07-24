import { useState,useEffect,useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { CartContext } from "../context/CartContext";
import { Link,useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  FaBars,
  FaTimes,
  FaHeart,
  FaShoppingCart,
  FaSearch,
} from "react-icons/fa";

const Navbar = () => {
const navigate = useNavigate();
const loggedUser = JSON.parse(localStorage.getItem("user"));
const [products, setProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const { cart, wishlist, search, setSearch } = useContext(CartContext);
  const closeMenu = () => setMenuOpen(false);

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

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return () => unsubscribe();
}, []);




  return (
    <header className="sticky top-0 z-50 bg-black text-white shadow-lg">
      <div className="
 max-w-7xl
 mx-auto
 px-3 sm:px-5 lg:px-6
 min-h-20
 flex
 items-center
 justify-between
 gap-3 sm:gap-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl sm:text:2xl xl:text-3xl font-bold text-yellow-500 whitespace-nowrap"
          onClick={closeMenu}
        >
          ScentAura
        </Link>

        {/* Desktop Menu */}
        
        <nav className="hidden lg:flex items-center gap-4 xl:gap-8 font-medium whitespace-nowrap">
          <Link className="hover:text-yellow-500 transition" to="/">
            Home
          </Link>

          <Link className="hover:text-yellow-500 transition" to="/perfumes">
            Perfumes
          </Link>

          <Link className="hover:text-yellow-500 transition" to="/men">
            Men
          </Link>

          <Link className="hover:text-yellow-500 transition" to="/women">
            Women
          </Link>

          <Link className="hover:text-yellow-500 transition" to="/unisex">
            Unisex
          </Link>
        </nav>

        {/* Desktop Icons */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-5 text-xl">

          
          <div className="relative hidden lg:flex items-center bg-white rounded-lg px-3 py-2 w-44 xl:w-60">
  <FaSearch className="text-gray-500 mr-2" />
  <input
    type="text"
    placeholder="Search perfumes..."
    value={search}
    onChange={(e) => {
  const value = e.target.value;

  setSearch(value);
  navigate("/perfumes");

  if(value.trim() === ""){
    setSuggestions([]);
    return;
  }

  const result = products.filter((item)=>
    item.name.toLowerCase().includes(value.toLowerCase())
  );

  setSuggestions(result.slice(0,5));
}}
    className="w-full bg-transparent outline-none text-black text-sm"
  />



{suggestions.length > 0 && (
  <div className="
    absolute
    top-12
    left-0
    w-full
    bg-white
    text-black
    rounded-lg
    shadow-xl
    overflow-hidden
    z-50
  ">
    {suggestions.map((item)=>(
      <div
        key={item._id}
        onClick={()=>{
          navigate(`/product/${item._id}`);
          setSuggestions([]);
          setSearch("");
        }}
        className="
          px-4
          py-3
          hover:bg-yellow-100
          cursor-pointer
          text-sm
        "
      >
        {item.name}
      </div>
    ))}
  </div>
)}



</div>

          
          <Link
           to="/wishlist"
           className="relative hover:text-yellow-500 transition"
           >
        <FaHeart size={22} />

         {wishlist.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {wishlist.length}
          </span>
           )}
           </Link>

            

          <Link
  to="/cart"
  className="relative hover:text-yellow-500 transition"
>
  <FaShoppingCart size={22} />

  {cart.length > 0 && (
    <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
      {cart.length}
    </span>
  )}
</Link>



                       {loggedUser?.role === "admin" && (
  <Link
    to="/admin"
    className="bg-blue-600 text-white px-3 xl:px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition whitespace-nowrap text-sm xl:text-base"
  >
    Admin Dashboard
  </Link>
)}

          {user ? (
         
  <button
  
    onClick={async () => {
  await signOut(auth);

  localStorage.removeItem("user");
  localStorage.removeItem("token");

  navigate("/login");
}}
    className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-800 transition"
  >
    Logout
  </button>
  
) : (


          <Link
               to="/login"
           className="bg-yellow-500 text-black px-3 xl:px-5 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
           >
            Login / Register
           </Link>
             )}


        </div>





        {/* Mobile Button */}
        <div className="lg:hidden flex items-center gap-3 sm:gap-4">

  <Link
    to="/wishlist"
    className="relative hover:text-yellow-500"
  >
    <FaHeart size={22} />
    {wishlist.length > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
        {wishlist.length}
      </span>
    )}
  </Link>

  <Link
    to="/cart"
    className="relative hover:text-yellow-500"
  >
    <FaShoppingCart size={22} />
    {cart.length > 0 && (
      <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
        {cart.length}
      </span>
    )}
  </Link>

  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="text-2xl"
  >
    {menuOpen ? <FaTimes /> : <FaBars />}
  </button>

</div>
</div>
      {/* Mobile Menu */}

      <div
        className={`lg:hidden bg-black overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-screen py-5" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-4 sm:px-6 gap-4 sm:gap-5">
          



            <div className="relative w-full flex items-center bg-white rounded-lg px-3 py-2">
  <FaSearch className="text-gray-500 mr-2" />

  <input
    type="text"
    placeholder="Search perfumes..."
    value={search}
    onChange={(e) => {
  const value = e.target.value;

  setSearch(value);
  navigate("/perfumes");

  if(value.trim() === ""){
    setSuggestions([]);
    return;
  }

  const result = products.filter((item)=>
    item.name.toLowerCase().includes(value.toLowerCase())
  );

  setSuggestions(result.slice(0,5));
}}

 onKeyDown={(e) => {
    if (e.key === "Enter") {
      closeMenu();

      navigate("/perfumes");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    }
  }}
    className="w-full bg-transparent outline-none text-black text-sm"
  />

{suggestions.length > 0 && (
  <div className="
    absolute
    top-12
    left-0
    w-full
    bg-white
    text-black
    rounded-lg
    shadow-xl
    overflow-hidden
    z-50
  ">

    {suggestions.map((item)=>(

      <div
        key={item._id}
        onClick={()=>{
          navigate(`/product/${item._id}`);
          setSuggestions([]);
          setSearch("");
          closeMenu();
        }}
        className="
          px-4
          py-3
          hover:bg-yellow-100
          cursor-pointer
          text-sm
        "
      >
        {item.name}
      </div>

    ))}

  </div>
)}


</div>

          <Link onClick={closeMenu} to="/">
            Home
          </Link>

          <Link onClick={closeMenu} to="/perfumes">
            Perfumes
          </Link>

          <Link onClick={closeMenu} to="/men">
            Men
          </Link>

          <Link onClick={closeMenu} to="/women">
            Women
          </Link>

          <Link onClick={closeMenu} to="/unisex">
            Unisex
          </Link>

          <Link onClick={closeMenu} to="/wishlist">
            Wishlist
          </Link>

          <Link onClick={closeMenu} to="/cart">
            Cart
          </Link>

                   {loggedUser?.role === "admin" && (
  <Link
    onClick={closeMenu}
    to="/admin"
    className="w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
  >
    Admin Dashboard
  </Link>
)} 



            {user ? (
  <button
    onClick={async () => {
  await signOut(auth);

  localStorage.removeItem("user");
  localStorage.removeItem("token");

  closeMenu();
  navigate("/login");
}}
    className="bg-red-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-red-600 transition"
  >
    Logout
  </button>
) : (


  <Link
        onClick={closeMenu}
        to="/login"
         className="bg-yellow-500 text-black text-center py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
         >   
         Login / Register
        </Link>
       )}


        </nav>
      </div>
    </header>
  );
};

export default Navbar;