import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AllPerfumes from "./pages/AllPerfumes";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Unisex from "./pages/Unisex";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedAdmin from "./components/ProtectedAdmin";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminUsers from "./pages/admin/AdminUsers";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <ScrollToTop />

      <Routes>
        {/* Public Storefront Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/unisex" element={<Unisex />} />
        <Route path="/perfumes" element={<AllPerfumes />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Protected Administration Routes */}
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
          <Route path="payments" element={<AdminPayments />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;