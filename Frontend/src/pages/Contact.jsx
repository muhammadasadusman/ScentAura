import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaPaperPlane,
  FaClock,
} from "react-icons/fa";

const Contact = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Order Inquiry",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post("/messages", formData);
      toast.success(data.message || "Message sent successfully! ✨");
      setSubmitted(true);
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        subject: "Order Inquiry",
        message: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <span className="text-amber-400 text-xs sm:text-sm font-bold tracking-[4px] uppercase">
          Client Care & Concierge
        </span>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent">
          How May We Assist You?
        </h1>
        <p className="mt-4 text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Whether you need personalized fragrance advice, support with an online payment
          (EasyPaisa, JazzCash, Bank), or order tracking, our fragrance specialists are at your disposal.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info Card */}
        <div className="bg-gradient-to-b from-neutral-900 to-neutral-900/80 border border-neutral-800 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <h2 className="text-xl font-bold text-amber-300 mb-6 flex items-center gap-2">
              Direct Assistance
            </h2>

            <div className="space-y-6 text-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <FaWhatsapp size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">WhatsApp Concierge</h3>
                  <a
                    href="https://wa.me/923001234567"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline text-xs block mt-0.5"
                  >
                    +92 (300) 1234567 (Chat Now)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <FaEnvelope size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">Email Inquiries</h3>
                  <p className="text-neutral-400 text-xs mt-0.5">
                    concierge@scentaura.pk
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <FaMapMarkerAlt size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">Boutique & Distribution</h3>
                  <p className="text-neutral-400 text-xs mt-0.5 leading-relaxed">
                    ScentAura Luxury Perfumery, Gulberg III, Lahore, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <FaClock size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">Operating Hours</h3>
                  <p className="text-neutral-400 text-xs mt-0.5">
                    Monday – Saturday: 10:00 AM – 10:00 PM PKT
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-800/80">
            <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase block">
              100% Genuine Perfumes
            </span>
            <p className="text-neutral-400 text-xs mt-1">
              Every scent in our portfolio is preserved under optimal temperature and humidity conditions.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="lg:col-span-2 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
                ✓
              </div>
              <h2 className="text-2xl font-bold text-white">Thank You for Contacting Us</h2>
              <p className="text-neutral-400 text-sm max-w-md mx-auto">
                Your message has been delivered to the ScentAura Admin team. We will review it and get in touch with you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-2.5 rounded-full text-xs transition"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Asad Usman"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. asad@example.com"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0300 1234567"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition cursor-pointer"
                  >
                    <option value="Order Inquiry">Order Inquiry / Tracking</option>
                    <option value="Payment Assistance">Payment Verification (EasyPaisa/JazzCash/Bank)</option>
                    <option value="Fragrance Recommendation">Fragrance Recommendation</option>
                    <option value="Custom Gift Order">Corporate / Gift Packaging</option>
                    <option value="Feedback & Suggestions">Feedback & Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Message Details *
                </label>
                <textarea
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can assist you with your order or fragrance choice..."
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl p-4 text-sm text-white outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold px-8 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <FaPaperPlane size={13} />
                    <span>Send Message to Concierge</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
