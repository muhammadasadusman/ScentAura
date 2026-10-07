
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CartProvider from "./context/CartContext.jsx"
import AuthProvider from "./context/AuthContext.jsx"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <CartProvider>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="dark"
      />
    </CartProvider>
  </AuthProvider>
)
