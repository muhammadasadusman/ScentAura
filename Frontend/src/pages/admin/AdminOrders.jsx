import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import { FaEye, FaReceipt, FaTimes } from "react-icons/fa";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [previewProof, setPreviewProof] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/orders");
      setOrders(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );
      if (selectedOrder?._id === id) {
        setSelectedOrder((prev) => ({ ...prev, status }));
      }
      toast.success(`Fulfillment status set to ${status}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update fulfillment status");
    }
  };

  const updatePaymentStatus = async (id, paymentStatus) => {
    try {
      await API.put(`/orders/${id}/payment-status`, { paymentStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, paymentStatus } : order
        )
      );
      if (selectedOrder?._id === id) {
        setSelectedOrder((prev) => ({ ...prev, paymentStatus }));
      }
      toast.success(`Payment status updated to ${paymentStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update payment status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Order Fulfillment & Payments
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Review customer orders, verify EasyPaisa/JazzCash/Bank screenshots, and manage shipping.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
        >
          Refresh Orders
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <h2 className="text-lg font-bold text-gray-500 animate-pulse">
            Loading Orders...
          </h2>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-neutral-900 text-white font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">TID / Proof</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Order Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-12 text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-mono text-gray-500 text-xs">
                        #{order._id.slice(-6)}
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-gray-900">
                          {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.customerInfo?.contact}
                        </p>
                        <p className="text-xs text-gray-400">
                          {order.customerInfo?.city}
                        </p>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-gray-800">
                          {order.products?.length} items
                        </span>
                        <p className="text-xs text-gray-400 truncate max-w-[150px]">
                          {order.products?.[0]?.name}
                        </p>
                      </td>

                      <td className="p-4 font-extrabold text-gray-900">
                        Rs. {Number(order.totalPrice).toLocaleString()}
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-md text-xs">
                          {order.paymentMethod}
                        </span>
                      </td>

                      <td className="p-4">
                        {order.transactionId ? (
                          <div className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                            TID: {order.transactionId}
                          </div>
                        ) : null}

                        {order.paymentProof ? (
                          <button
                            onClick={() => setPreviewProof(order.paymentProof)}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-bold underline mt-1"
                          >
                            <FaReceipt size={12} /> View Screenshot
                          </button>
                        ) : (
                          !order.transactionId && (
                            <span className="text-gray-400 text-xs italic">
                              {order.paymentMethod === "Cash On Delivery"
                                ? "Cash on delivery"
                                : "No receipt attached"}
                            </span>
                          )
                        )}
                      </td>

                      <td className="p-4">
                        <select
                          value={order.paymentStatus || "Pending"}
                          onChange={(e) =>
                            updatePaymentStatus(order._id, e.target.value)
                          }
                          className={`font-bold text-xs px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer ${
                            order.paymentStatus === "Verified" || order.paymentStatus === "Paid"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : order.paymentStatus === "Failed"
                              ? "bg-rose-50 text-rose-800 border-rose-300"
                              : "bg-amber-50 text-amber-800 border-amber-300"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Verified">Verified</option>
                          <option value="Paid">Paid</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </td>

                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order._id, e.target.value)
                          }
                          className={`font-bold text-xs px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer ${
                            order.status === "Delivered"
                              ? "bg-green-50 text-green-800 border-green-300"
                              : order.status === "Shipped"
                              ? "bg-blue-50 text-blue-800 border-blue-300"
                              : order.status === "Cancelled"
                              ? "bg-red-50 text-red-800 border-red-300"
                              : order.status === "Processing"
                              ? "bg-purple-50 text-purple-800 border-purple-300"
                              : "bg-yellow-50 text-yellow-800 border-yellow-300"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                          className="bg-black hover:bg-neutral-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Proof Lightbox Modal */}
      {previewProof && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 relative shadow-2xl">
            <button
              onClick={() => setPreviewProof(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black font-bold text-xl p-1"
            >
              <FaTimes />
            </button>
            <h3 className="font-bold text-base text-gray-900 mb-3 flex items-center gap-2">
              <FaReceipt className="text-amber-500" /> Customer Payment Receipt
            </h3>
            <div className="rounded-xl overflow-hidden bg-gray-100 max-h-[70vh] flex items-center justify-center">
              <img
                src={previewProof}
                alt="Payment proof"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Full Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase">
                  Order Summary
                </span>
                <h2 className="text-xl font-extrabold text-gray-900">
                  Order #{selectedOrder._id}
                </h2>
                <p className="text-xs text-gray-400">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-black text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Customer Details */}
            <div className="bg-gray-50 p-4 rounded-xl text-xs space-y-2">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                Customer Information
              </h3>
              <p>
                <strong>Name:</strong> {selectedOrder.customerInfo?.firstName} {selectedOrder.customerInfo?.lastName}
              </p>
              <p>
                <strong>Contact Phone/Email:</strong> {selectedOrder.customerInfo?.contact}
              </p>
              <p>
                <strong>Delivery Address:</strong> {selectedOrder.customerInfo?.address},{" "}
                {selectedOrder.customerInfo?.apartment ? `${selectedOrder.customerInfo?.apartment}, ` : ""}
                {selectedOrder.customerInfo?.city}, {selectedOrder.customerInfo?.country}
              </p>
            </div>

            {/* Payment Details Box */}
            <div className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-xl text-xs space-y-3">
              <h3 className="font-bold text-sm text-amber-900 uppercase tracking-wide flex items-center gap-2">
                <FaReceipt /> Payment & Verification
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-500 block">Payment Method</span>
                  <span className="font-bold text-gray-900">{selectedOrder.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Payment Status</span>
                  <span className="font-bold text-amber-800">{selectedOrder.paymentStatus || "Pending"}</span>
                </div>
              </div>

              {selectedOrder.transactionId && (
                <div>
                  <span className="text-gray-500 block">Transaction ID (TID)</span>
                  <span className="font-mono font-bold text-emerald-700 bg-white px-2 py-1 rounded border inline-block">
                    {selectedOrder.transactionId}
                  </span>
                </div>
              )}

              {selectedOrder.paymentProof && (
                <div>
                  <span className="text-gray-500 block mb-1">Receipt Screenshot</span>
                  <button
                    onClick={() => setPreviewProof(selectedOrder.paymentProof)}
                    className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    <FaEye /> Open Receipt Screenshot
                  </button>
                </div>
              )}
            </div>

            {/* Product items */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase text-gray-500 tracking-wider">
                Products Ordered
              </h3>
              <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                {selectedOrder.products?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg border"
                      />
                      <div>
                        <p className="font-bold text-xs text-gray-900">{item.name}</p>
                        <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-xs text-gray-900">
                      Rs. {Number(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="pt-3 border-t text-xs space-y-1.5">
              <div className="flex justify-between text-gray-500">
                <span>Shipping:</span>
                <span>Rs. {selectedOrder.shippingPrice || 200}</span>
              </div>
              <div className="flex justify-between font-black text-base text-gray-900 pt-2 border-t">
                <span>Total Amount:</span>
                <span>Rs. {Number(selectedOrder.totalPrice).toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-neutral-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;