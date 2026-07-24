import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllPerfumes from "./pages/AllPerfumes";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Unisex from "./pages/Unisex";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import ProtectedAdmin from "./components/ProtectedAdmin";
import AdminUsers from "./pages/admin/AdminUsers";

import Cart from "./pages/Cart";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <BrowserRouter>
    <Navbar/>
    <ScrollToTop />

    <Routes>

  {/* Public Routes */}

  <Route path="/" element={<Home />} />

  <Route path="/login" element={<Login />} />

  <Route path="/wishlist" element={<Wishlist />} />

  <Route path="/men" element={<Men />} />

  <Route path="/women" element={<Women />} />

  <Route path="/unisex" element={<Unisex />} />

  <Route path="/perfumes" element={<AllPerfumes />} />

  <Route path="/cart" element={<Cart />} />

  <Route path="/checkout" element={<Checkout />} />

  <Route path="/product/:id" element={<ProductDetails />} />


<Route
  path="/admin/products"
  element={
    <ProtectedAdmin>
      <AdminProducts />
    </ProtectedAdmin>
  }
/>

<Route
  path="/admin"
  element={
    <ProtectedAdmin>
      <AdminLayout />
    </ProtectedAdmin>
  }
>

 <Route index element={<AdminDashboard />} />
  <Route path="orders" element={<AdminOrders />} />
  <Route path="products" element={<AdminProducts />} />
  <Route path="users" element={<AdminUsers />} />

  <Route index element={<AdminDashboard />} />
  <Route path="orders" element={<AdminOrders />} />
</Route>


  {/* 404 */}

  <Route path="*" element={<NotFound />} />

</Routes>
      <Footer/>
    </BrowserRouter>

    
  );
};

export default App;