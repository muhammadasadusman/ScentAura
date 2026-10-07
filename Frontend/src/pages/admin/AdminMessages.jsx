import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaTrash,
  FaWhatsapp,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/messages");
      setMessages(data.messages || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load customer messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (message) => {
    try {
      const newStatus = !message.isRead;
      await API.patch(`/messages/${message._id}/read`, { isRead: newStatus });
      setMessages((prev) =>
        prev.map((m) =>
          m._id === message._id ? { ...m, isRead: newStatus } : m
        )
      );
      toast.info(`Marked as ${newStatus ? "read" : "unread"}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await API.delete(`/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message");
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Customer Inquiries
            </h1>
            {unreadCount > 0 && (
              <span className="bg-amber-500 text-black text-xs font-black px-2.5 py-1 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Read and reply to concierge inquiries, custom requests, and payment help.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
        >
          Refresh Inbox
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <h2 className="text-lg font-bold text-gray-500 animate-pulse">
            Loading Inquiries...
          </h2>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <FaEnvelopeOpen className="mx-auto text-4xl text-gray-300 mb-3" />
          <h2 className="text-lg font-bold text-gray-700">No Messages Found</h2>
          <p className="text-sm text-gray-500 mt-1">
            When customers submit inquiries from the Contact page, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of Messages */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100 max-h-[750px] overflow-y-auto">
            {messages.map((m) => {
              const isSelected = selectedMessage?._id === m._id;
              return (
                <div
                  key={m._id}
                  onClick={() => {
                    setSelectedMessage(m);
                    if (!m.isRead) handleToggleRead(m);
                  }}
                  className={`p-4 cursor-pointer transition flex flex-col gap-1.5 ${
                    isSelected
                      ? "bg-amber-50/70 border-l-4 border-amber-500"
                      : m.isRead
                      ? "hover:bg-gray-50"
                      : "bg-amber-50/20 font-semibold hover:bg-amber-50/40"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-900 truncate">
                      {m.name}
                    </span>
                    <span className="text-gray-400 text-[11px]">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-amber-700 font-medium truncate">
                    {m.subject}
                  </p>

                  <p className="text-xs text-gray-500 line-clamp-1">
                    {m.message}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    {!m.isRead && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                    )}
                    <span className="text-[10px] text-gray-400">
                      {m.email}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Detail Pane */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 flex flex-col justify-between">
            {selectedMessage ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                      {selectedMessage.subject}
                    </span>
                    <h2 className="text-xl font-extrabold text-gray-900 mt-0.5">
                      {selectedMessage.name}
                    </h2>
                    <p className="text-xs text-gray-500">
                      Received on {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRead(selectedMessage)}
                      title={selectedMessage.isRead ? "Mark as Unread" : "Mark as Read"}
                      className="p-2 border rounded-xl text-gray-600 hover:bg-gray-100 transition"
                    >
                      {selectedMessage.isRead ? <FaEnvelope /> : <FaCheckCircle className="text-emerald-500" />}
                    </button>

                    <button
                      onClick={() => handleDelete(selectedMessage._id)}
                      title="Delete Inquiry"
                      className="p-2 border rounded-xl text-red-500 hover:bg-red-50 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {/* Contact Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-xs">
                  <div>
                    <span className="text-gray-400 block font-medium">Email Address</span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="font-bold text-gray-800 hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>

                  <div>
                    <span className="text-gray-400 block font-medium">Phone / WhatsApp</span>
                    <span className="font-bold text-gray-800">
                      {selectedMessage.phone || "Not provided"}
                    </span>
                  </div>
                </div>

                {/* Full Message Body */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Inquiry Message
                  </h3>
                  <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-5 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Quick Reply Bar */}
                <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Regarding: ${encodeURIComponent(
                      selectedMessage.subject
                    )}&body=Hello ${encodeURIComponent(selectedMessage.name)},\n\nThank you for reaching out to ScentAura.`}
                    className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition"
                  >
                    <FaEnvelope size={13} />
                    Reply via Email
                  </a>

                  {selectedMessage.phone && (
                    <a
                      href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition"
                    >
                      <FaWhatsapp size={15} />
                      Reply on WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-24 text-gray-400 text-center">
                <FaClock size={36} className="mb-3 text-gray-300" />
                <p className="text-sm font-semibold">Select a message from the left to read details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
