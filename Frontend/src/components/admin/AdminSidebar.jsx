import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaShoppingBag,
  FaBox,
  FaUsers,
  FaSignOutAlt,
  FaCreditCard,
  FaComments,
  FaStore,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", path: "/admin", icon: FaChartBar },
    { label: "Orders", path: "/admin/orders", icon: FaShoppingBag },
    { label: "Products", path: "/admin/products", icon: FaBox },
    { label: "Payments", path: "/admin/payments", icon: FaCreditCard },
    { label: "Messages", path: "/admin/messages", icon: FaComments },
    { label: "Users", path: "/admin/users", icon: FaUsers },
  ];

  return (
    <aside className="w-48 sm:w-56 min-h-screen bg-neutral-950 text-white p-4 border-r border-neutral-800 flex flex-col justify-between flex-shrink-0">
      <div>
        {/* Brand */}
        <div className="pb-6 mb-6 border-b border-neutral-800">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-extrabold text-sm">
              S
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white group-hover:text-amber-400 transition">
                ScentAura
              </h2>
              <span className="text-[10px] tracking-widest text-amber-500 font-bold uppercase block">
                Management
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-6 border-t border-neutral-800 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-400 hover:text-amber-400 transition"
        >
          <FaStore size={14} />
          <span>View Live Store</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition"
        >
          <FaSignOutAlt size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;