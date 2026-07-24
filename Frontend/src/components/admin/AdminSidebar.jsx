import { Link } from "react-router-dom";
import {
  FaChartBar,
  FaShoppingBag,
  FaBox,
  FaUsers,
  FaSignOutAlt
} from "react-icons/fa";


const AdminSidebar = () => {

  return (

    <div className="w-36 sm:w-44 md:w-48 min-h-screen bg-black text-white p-3 sm:p-4">

      <h1 className="text-lg sm:text-xl font-bold text-yellow-500 mb-8">
        ScentAura
        <span className="block">
          Admin
        </span>
      </h1>


      <nav className="space-y-4">


        <Link
          to="/admin"
          className="flex items-center gap-2 text-sm hover:text-yellow-500"
        >
          <FaChartBar />
          Dashboard
        </Link>


        <Link
          to="/admin/orders"
          className="flex items-center gap-2 text-sm hover:text-yellow-500"
        >
          <FaShoppingBag />
          Orders
        </Link>


        <Link
          to="/admin/products"
          className="flex items-center gap-2 text-sm hover:text-yellow-500"
        >
          <FaBox />
          Products
        </Link>


        <Link
          to="/admin/users"
          className="flex items-center gap-2 text-sm hover:text-yellow-500"
        >
          <FaUsers />
          Users
        </Link>


        <button
          className="flex items-center gap-2 text-sm hover:text-red-500"
        >
          <FaSignOutAlt />
          Logout
        </button>


      </nav>


    </div>

  );
};


export default AdminSidebar;