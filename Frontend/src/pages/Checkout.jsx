import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FaCheckCircle, FaCopy, FaUpload, FaMoneyBillWave, FaMobileAlt, FaUniversity, FaCheck } from "react-icons/fa";
import API from "../services/api";
import { toast } from "react-toastify";

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useAuth();

  const shipping = 200;
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const total = subtotal + shipping;

  const [paymentSettings, setPaymentSettings] = useState({
    easypaisa: { enabled: true, accountTitle: "ScentAura Store", accountNumber: "03001234567", instructions: "" },
    jazzcash: { enabled: true, accountTitle: "ScentAura Store", accountNumber: "03007654321", instructions: "" },
    bank: { enabled: true, bankName: "Meezan Bank", accountTitle: "ScentAura Luxury Perfumes", accountNumber: "01020304050607", iban: "PK00MEZN0000010203040506", instructions: "" },
  });

  const [formData, setFormData] = useState({
    contact: "",
    country: "Pakistan",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    paymentMethod: "Cash On Delivery",
    transactionId: "",
    paymentProof: "",
  });

  const [copiedField, setCopiedField] = useState("");
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      const nameParts = (user.name || "").split(" ");
      setFormData((prev) => ({
        ...prev,
        contact: prev.contact || user.email || "",
        firstName: prev.firstName || nameParts[0] || "",
        lastName: prev.lastName || nameParts.slice(1).join(" ") || "",
      }));
    }

    const fetchPaymentSettings = async () => {
      try {
        const { data } = await API.get("/payments/active");
        if (data.data) {
          setPaymentSettings(data.data);
        }
      } catch (e) {
        console.error("Failed to load active payments:", e);
      }
    };
    fetchPaymentSettings();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(""), 2000);
  };

  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingReceipt(true);
    try {
      const uploadData = new FormData();
      uploadData.append("image", file);

      const { data } = await API.post("/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prev) => ({
        ...prev,
        paymentProof: data.imageUrl,
      }));
      toast.success("Payment receipt uploaded successfully! ✨");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload screenshot. Please try again.");
    } finally {
      setUploadingReceipt(false);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.contact.trim()) newErrors.contact = "Contact email or phone is required.";
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!formData.address.trim()) newErrors.address = "Delivery address is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";

    if (formData.paymentMethod !== "Cash On Delivery") {
      if (!formData.transactionId.trim() && !formData.paymentProof) {
        newErrors.transactionId =
          "Please enter your Transaction ID (TID) or upload your payment screenshot.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const placeOrder = async () => {
    setSubmitting(true);
    try {
      const orderPayload = {
        customerInfo: {
          contact: formData.contact,
          country: formData.country,
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        products: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingPrice: shipping,
        totalPrice: total,
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId,
        paymentProof: formData.paymentProof,
      };

      const { data } = await API.post("/orders", orderPayload);
      setPlacedOrderDetails(data.order);
      clearCart();
      setOrderSuccess(true);
      toast.success("Order placed successfully! 🎉");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 py-16 text-white">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-2xl relative">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-3xl font-black mb-6 animate-bounce">
            ✓
          </div>

          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Order Confirmation
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Order Placed Successfully!
          </h2>

          <p className="text-neutral-400 text-sm mt-3 leading-relaxed">
            Thank you for selecting <b className="text-white">ScentAura</b>. Your fragrance order{" "}
            {placedOrderDetails?._id && (
              <span className="font-mono text-amber-300">
                (#{placedOrderDetails._id.slice(-6)})
              </span>
            )}{" "}
            has been received.
          </p>

          <div className="my-6 bg-neutral-950/80 border border-neutral-800 p-4 rounded-2xl text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-400">Payment Method:</span>
              <span className="font-bold text-white">{formData.paymentMethod}</span>
            </div>
            {formData.transactionId && (
              <div className="flex justify-between">
                <span className="text-neutral-400">Transaction ID (TID):</span>
                <span className="font-mono text-amber-300 font-bold">{formData.transactionId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-neutral-400">Total Amount:</span>
              <span className="font-extrabold text-amber-400">Rs. {Number(total).toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black py-3.5 rounded-xl font-extrabold text-sm transition shadow-lg shadow-amber-500/20"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white px-4 text-center py-20">
        <span className="text-6xl mb-4">🛒</span>
        <h2 className="text-2xl sm:text-3xl font-bold">Your Cart is Empty</h2>
        <p className="text-neutral-400 text-sm mt-2 max-w-sm">
          Please add a luxury perfume to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => (window.location.href = "/perfumes")}
          className="mt-6 bg-amber-400 hover:bg-amber-500 text-black px-6 py-3 rounded-full font-bold text-sm"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Secure Checkout
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Order & Delivery Details
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Form: Delivery & Online Payments */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Information Box */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
              <h2 className="text-lg font-bold text-amber-300 pb-3 border-b border-neutral-800">
                1. Contact & Shipping Address
              </h2>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase mb-2">
                  Email or Mobile Phone *
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="e.g. 0300 1234567 or asad@example.com"
                  className={`w-full bg-neutral-950 border rounded-xl px-4 py-3 text-sm text-white outline-none ${
                    errors.contact ? "border-red-500" : "border-neutral-800 focus:border-amber-500"
                  }`}
                />
                {errors.contact && <p className="text-red-400 text-xs mt-1">{errors.contact}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className={`w-full bg-neutral-950 border rounded-xl px-4 py-3 text-sm text-white outline-none ${
                      errors.firstName ? "border-red-500" : "border-neutral-800 focus:border-amber-500"
                    }`}
                  />
                  {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className={`w-full bg-neutral-950 border rounded-xl px-4 py-3 text-sm text-white outline-none ${
                      errors.lastName ? "border-red-500" : "border-neutral-800 focus:border-amber-500"
                    }`}
                  />
                  {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase mb-2">
                  Complete Delivery Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House / Street / Area / Landmark"
                  className={`w-full bg-neutral-950 border rounded-xl px-4 py-3 text-sm text-white outline-none ${
                    errors.address ? "border-red-500" : "border-neutral-800 focus:border-amber-500"
                  }`}
                />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Lahore / Karachi / Islamabad"
                    className={`w-full bg-neutral-950 border rounded-xl px-4 py-3 text-sm text-white outline-none ${
                      errors.city ? "border-red-500" : "border-neutral-800 focus:border-amber-500"
                    }`}
                  />
                  {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase mb-2">
                    Apartment / Suite (Optional)
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    placeholder="Apt, Suite, Unit"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector Box */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-amber-300">
                  2. Select Payment Method
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Choose Cash on Delivery or transfer online via EasyPaisa, JazzCash, or Bank Transfer.
                </p>
              </div>

              {/* Payment Method Radio Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Cash On Delivery */}
                <label
                  onClick={() => setFormData({ ...formData, paymentMethod: "Cash On Delivery" })}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                    formData.paymentMethod === "Cash On Delivery"
                      ? "bg-amber-500/10 border-amber-500 text-white"
                      : "bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <FaMoneyBillWave size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-sm block">Cash On Delivery</span>
                    <span className="text-[11px] text-neutral-400">Pay cash upon delivery</span>
                  </div>
                </label>

                {/* EasyPaisa */}
                {paymentSettings.easypaisa?.enabled && (
                  <label
                    onClick={() => setFormData({ ...formData, paymentMethod: "EasyPaisa" })}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                      formData.paymentMethod === "EasyPaisa"
                        ? "bg-emerald-500/10 border-emerald-500 text-white"
                        : "bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <FaMobileAlt size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-sm block">EasyPaisa</span>
                      <span className="text-[11px] text-neutral-400">Mobile Wallet Instant</span>
                    </div>
                  </label>
                )}

                {/* JazzCash */}
                {paymentSettings.jazzcash?.enabled && (
                  <label
                    onClick={() => setFormData({ ...formData, paymentMethod: "JazzCash" })}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                      formData.paymentMethod === "JazzCash"
                        ? "bg-red-500/10 border-red-500 text-white"
                        : "bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                      <FaMobileAlt size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-sm block">JazzCash</span>
                      <span className="text-[11px] text-neutral-400">Mobile Wallet Instant</span>
                    </div>
                  </label>
                )}

                {/* Bank Transfer */}
                {paymentSettings.bank?.enabled && (
                  <label
                    onClick={() => setFormData({ ...formData, paymentMethod: "Bank Transfer" })}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                      formData.paymentMethod === "Bank Transfer"
                        ? "bg-blue-500/10 border-blue-500 text-white"
                        : "bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <FaUniversity size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-sm block">Bank Transfer</span>
                      <span className="text-[11px] text-neutral-400">Direct IBAN / Online App</span>
                    </div>
                  </label>
                )}
              </div>

              {/* Dynamic Online Account Instructions Panel */}
              {formData.paymentMethod === "EasyPaisa" && (
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                    <div>
                      <span className="text-xs text-emerald-400 font-bold uppercase">Send Payment To:</span>
                      <h3 className="text-lg font-extrabold text-white">
                        {paymentSettings.easypaisa.accountTitle || "ScentAura"}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-neutral-400 block">EasyPaisa Number</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-emerald-300">
                          {paymentSettings.easypaisa.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(paymentSettings.easypaisa.accountNumber, "EasyPaisa Number")}
                          className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 rounded-lg text-xs"
                        >
                          {copiedField === "EasyPaisa Number" ? <FaCheck /> : <FaCopy />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {paymentSettings.easypaisa.instructions ||
                      "Send the exact total amount to the EasyPaisa number above, then enter the Transaction ID (TID) or attach a screenshot."}
                  </p>
                </div>
              )}

              {formData.paymentMethod === "JazzCash" && (
                <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-red-500/20">
                    <div>
                      <span className="text-xs text-red-400 font-bold uppercase">Send Payment To:</span>
                      <h3 className="text-lg font-extrabold text-white">
                        {paymentSettings.jazzcash.accountTitle || "ScentAura"}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-neutral-400 block">JazzCash Number</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-red-300">
                          {paymentSettings.jazzcash.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(paymentSettings.jazzcash.accountNumber, "JazzCash Number")}
                          className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg text-xs"
                        >
                          {copiedField === "JazzCash Number" ? <FaCheck /> : <FaCopy />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {paymentSettings.jazzcash.instructions ||
                      "Send the exact total amount to the JazzCash number above, then enter the Transaction ID (TID) or attach a screenshot."}
                  </p>
                </div>
              )}

              {formData.paymentMethod === "Bank Transfer" && (
                <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-5 space-y-4">
                  <div className="pb-3 border-b border-blue-500/20 space-y-2">
                    <span className="text-xs text-blue-400 font-bold uppercase">Bank Account Details:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-neutral-400 block">Bank Name</span>
                        <strong className="text-white text-sm">{paymentSettings.bank.bankName}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-400 block">Account Title</span>
                        <strong className="text-white text-sm">{paymentSettings.bank.accountTitle}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-400 block">Account Number</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-blue-300 font-mono text-sm">{paymentSettings.bank.accountNumber}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy(paymentSettings.bank.accountNumber, "Account Number")}
                            className="p-1 text-blue-300 hover:text-white"
                          >
                            {copiedField === "Account Number" ? <FaCheck /> : <FaCopy />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-neutral-400 block">IBAN</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-blue-300 font-mono text-xs">{paymentSettings.bank.iban}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy(paymentSettings.bank.iban, "IBAN")}
                            className="p-1 text-blue-300 hover:text-white"
                          >
                            {copiedField === "IBAN" ? <FaCheck /> : <FaCopy />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {paymentSettings.bank.instructions ||
                      "Transfer the total order amount to our bank account. Then enter the Transaction ID or upload your transfer receipt."}
                  </p>
                </div>
              )}

              {/* Transaction ID & Screenshot Upload for Online Payments */}
              {formData.paymentMethod !== "Cash On Delivery" && (
                <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Payment Verification Proof
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase mb-2">
                      Transaction ID / Reference Number (TID)
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleChange}
                      placeholder="e.g. 12345678901 (from SMS or banking app)"
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none font-mono"
                    />
                    {errors.transactionId && (
                      <p className="text-red-400 text-xs mt-1">{errors.transactionId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase mb-2">
                      Upload Screenshot / Transfer Receipt (Optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-amber-500 text-neutral-300 hover:text-white px-4 py-2.5 rounded-xl cursor-pointer text-xs font-bold transition">
                        <FaUpload />
                        <span>{uploadingReceipt ? "Uploading..." : "Choose Image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleReceiptUpload}
                          className="hidden"
                        />
                      </label>

                      {formData.paymentProof && (
                        <div className="flex items-center gap-2">
                          <img
                            src={formData.paymentProof}
                            alt="Receipt"
                            className="w-10 h-10 object-cover rounded-lg border border-amber-500"
                          />
                          <span className="text-xs text-emerald-400 font-bold">Screenshot Attached ✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 h-fit lg:sticky lg:top-24 space-y-6 shadow-2xl">
            <h2 className="text-lg font-bold text-amber-300 pb-3 border-b border-neutral-800">
              Order Summary
            </h2>

            <div className="space-y-4 max-h-72 overflow-y-auto divide-y divide-neutral-800">
              {cart.map((item) => (
                <div key={item._id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-neutral-800"
                    />
                    <div>
                      <p className="font-bold text-white line-clamp-1">{item.name}</p>
                      <p className="text-neutral-400">
                        Rs. {Number(item.price).toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-white">
                    Rs. {Number(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-neutral-800 text-xs space-y-2">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal:</span>
                <span>Rs. {Number(subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Standard Delivery (PK):</span>
                <span>Rs. {shipping}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-black text-amber-400 pt-2 border-t border-neutral-800">
                <span>Total Amount:</span>
                <span>Rs. {Number(total).toLocaleString()}</span>
              </div>
            </div>

            {/* Complete Order Button */}
            <button
              onClick={() => {
                if (validateForm()) {
                  placeOrder();
                }
              }}
              disabled={submitting}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black py-4 rounded-xl font-black text-sm tracking-wide transition shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
            >
              {submitting ? "Placing Order..." : `Confirm Order (Rs. ${Number(total).toLocaleString()})`}
            </button>

            <div className="text-[11px] text-neutral-400 text-center flex items-center justify-center gap-1.5">
              <FaCheckCircle className="text-amber-400" />
              <span>Safe & Secure Packaging Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
