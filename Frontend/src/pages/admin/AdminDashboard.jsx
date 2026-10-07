import { useEffect, useState } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";
import {
  FaShoppingBag,
  FaBox,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaUsers,
  FaComments,
  FaCreditCard,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    users: 0,
    revenue: 0,
    pending: 0,
    delivered: 0,
    unreadMessages: 0,
    pendingPayments: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [ordersRes, productsRes, usersRes, messagesRes] = await Promise.all([
        API.get("/orders"),
        API.get("/products"),
        API.get("/users"),
        API.get("/messages").catch(() => ({ data: { unreadCount: 0 } })),
      ]);

      const orders = ordersRes.data || [];
      const revenue = orders.reduce(
        (total, order) => total + (order.totalPrice || 0),
        0
      );

      const pending = orders.filter((order) => order.status === "Pending").length;
      const delivered = orders.filter((order) => order.status === "Delivered").length;
      const pendingPayments = orders.filter(
        (order) =>
          order.paymentMethod !== "Cash On Delivery" &&
          order.paymentStatus === "Pending"
      ).length;

      setStats({
        orders: orders.length,
        products: (productsRes.data || []).length,
        users: (usersRes.data || []).length,
        revenue,
        pending,
        delivered,
        unreadMessages: messagesRes.data?.unreadCount || 0,
        pendingPayments,
      });

      setRecentOrders(orders.slice(0, 6));
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const statCards = [
    {
      label: "Total Revenue",
      value: `Rs. ${stats.revenue.toLocaleString()}`,
      icon: FaMoneyBillWave,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Total Orders",
      value: stats.orders,
      icon: FaShoppingBag,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Pending Orders",
      value: stats.pending,
      icon: FaClock,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      label: "Delivered Orders",
      value: stats.delivered,
      icon: FaCheckCircle,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Online Payments To Verify",
      value: stats.pendingPayments,
      icon: FaCreditCard,
      color: "text-indigo-600 bg-indigo-50",
      link: "/admin/orders",
    },
    {
      label: "Unread Messages",
      value: stats.unreadMessages,
      icon: FaComments,
      color: "text-purple-600 bg-purple-50",
      link: "/admin/messages",
    },
    {
      label: "Total Perfumes",
      value: stats.products,
      icon: FaBox,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Registered Users",
      value: stats.users,
      icon: FaUsers,
      color: "text-rose-600 bg-rose-50",
    },
  ];

  if (loading) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-gray-700 animate-pulse">
          Loading Analytics...
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            ScentAura Overview
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Store performance metrics, sales revenue, and real-time operational status.
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
        >
          Refresh Analytics
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const content = (
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {card.label}
                </p>
                <h2 className="text-2xl font-black text-gray-900 mt-1">
                  {card.value}
                </h2>
              </div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${card.color}`}
              >
                <Icon />
              </div>
            </div>
          );

          return card.link ? (
            <Link key={i} to={card.link}>
              {content}
            </Link>
          ) : (
            <div key={i}>{content}</div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Customer Orders</h2>
            <p className="text-xs text-gray-500">Latest purchases and payment verification status</p>
          </div>

          <Link
            to="/admin/orders"
            className="text-amber-600 hover:text-amber-700 text-xs font-bold hover:underline"
          >
            View All Orders →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            No orders received yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="text-gray-400 font-bold uppercase text-[11px] border-b border-gray-100 pb-2">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Payment Status</th>
                  <th className="pb-3">Order Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3.5 font-mono text-gray-500">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="py-3.5">
                      <p className="font-bold text-gray-900">
                        {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {order.customerInfo?.city}
                      </p>
                    </td>
                    <td className="py-3.5">
                      <span className="font-semibold text-gray-700">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-gray-900">
                      Rs. {Number(order.totalPrice).toLocaleString()}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          order.paymentStatus === "Verified" || order.paymentStatus === "Paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : order.paymentStatus === "Failed"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.paymentStatus || "Pending"}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          order.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : order.status === "Shipped"
                            ? "bg-indigo-100 text-indigo-800"
                            : order.status === "Cancelled"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;