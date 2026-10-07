import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import { FaSave, FaMobileAlt, FaUniversity, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const AdminPayments = () => {
  const [settings, setSettings] = useState({
    easypaisa: {
      enabled: true,
      accountTitle: "",
      accountNumber: "",
      instructions: "",
    },
    jazzcash: {
      enabled: true,
      accountTitle: "",
      accountNumber: "",
      instructions: "",
    },
    bank: {
      enabled: true,
      bankName: "",
      accountTitle: "",
      accountNumber: "",
      iban: "",
      instructions: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/payments/admin");
      if (data.data) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load payment settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggle = (method) => {
    setSettings((prev) => ({
      ...prev,
      [method]: {
        ...prev[method],
        enabled: !prev[method].enabled,
      },
    }));
  };

  const handleChange = (method, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [method]: {
        ...prev[method],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put("/payments/admin", settings);
      toast.success("Payment settings updated successfully! ✨");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update payment settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-gray-700 animate-pulse">
          Loading Payment Settings...
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Online Payment Settings
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Configure your EasyPaisa, JazzCash, and Bank Transfer accounts. Customers will see these details at checkout.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 bg-black hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50"
        >
          <FaSave size={15} />
          {saving ? "Saving..." : "Save All Settings"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* EasyPaisa Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-black shadow-sm">
                <FaMobileAlt />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">EasyPaisa Account</h2>
                <p className="text-xs text-gray-500">Instant mobile wallet payments</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggle("easypaisa")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition ${
                settings.easypaisa.enabled
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {settings.easypaisa.enabled ? (
                <>
                  <FaCheckCircle /> Enabled
                </>
              ) : (
                <>
                  <FaTimesCircle /> Disabled
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                EasyPaisa Account Title
              </label>
              <input
                type="text"
                value={settings.easypaisa.accountTitle}
                onChange={(e) => handleChange("easypaisa", "accountTitle", e.target.value)}
                placeholder="e.g. Asad Usman"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                EasyPaisa Mobile Number
              </label>
              <input
                type="text"
                value={settings.easypaisa.accountNumber}
                onChange={(e) => handleChange("easypaisa", "accountNumber", e.target.value)}
                placeholder="e.g. 03001234567"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
              Instructions for Customer
            </label>
            <textarea
              rows="2"
              value={settings.easypaisa.instructions}
              onChange={(e) => handleChange("easypaisa", "instructions", e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-amber-500 outline-none"
            />
          </div>
        </div>

        {/* JazzCash Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xl font-black shadow-sm">
                <FaMobileAlt />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">JazzCash Account</h2>
                <p className="text-xs text-gray-500">Direct JazzCash wallet transfers</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggle("jazzcash")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition ${
                settings.jazzcash.enabled
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {settings.jazzcash.enabled ? (
                <>
                  <FaCheckCircle /> Enabled
                </>
              ) : (
                <>
                  <FaTimesCircle /> Disabled
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                JazzCash Account Title
              </label>
              <input
                type="text"
                value={settings.jazzcash.accountTitle}
                onChange={(e) => handleChange("jazzcash", "accountTitle", e.target.value)}
                placeholder="e.g. Asad Usman"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                JazzCash Mobile Number
              </label>
              <input
                type="text"
                value={settings.jazzcash.accountNumber}
                onChange={(e) => handleChange("jazzcash", "accountNumber", e.target.value)}
                placeholder="e.g. 03007654321"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
              Instructions for Customer
            </label>
            <textarea
              rows="2"
              value={settings.jazzcash.instructions}
              onChange={(e) => handleChange("jazzcash", "instructions", e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-amber-500 outline-none"
            />
          </div>
        </div>

        {/* Bank Transfer Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-black shadow-sm">
                <FaUniversity />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Direct Bank Transfer</h2>
                <p className="text-xs text-gray-500">Meezan, HBL, Alfalah, or any Pakistani Bank</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggle("bank")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition ${
                settings.bank.enabled
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {settings.bank.enabled ? (
                <>
                  <FaCheckCircle /> Enabled
                </>
              ) : (
                <>
                  <FaTimesCircle /> Disabled
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                Bank Name
              </label>
              <input
                type="text"
                value={settings.bank.bankName}
                onChange={(e) => handleChange("bank", "bankName", e.target.value)}
                placeholder="e.g. Meezan Bank / HBL"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                Account Title
              </label>
              <input
                type="text"
                value={settings.bank.accountTitle}
                onChange={(e) => handleChange("bank", "accountTitle", e.target.value)}
                placeholder="e.g. ScentAura Luxury Perfumes"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                Account Number
              </label>
              <input
                type="text"
                value={settings.bank.accountNumber}
                onChange={(e) => handleChange("bank", "accountNumber", e.target.value)}
                placeholder="e.g. 01020304050607"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                IBAN Number
              </label>
              <input
                type="text"
                value={settings.bank.iban}
                onChange={(e) => handleChange("bank", "iban", e.target.value)}
                placeholder="e.g. PK00MEZN0000010203040506"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
              Instructions for Customer
            </label>
            <textarea
              rows="2"
              value={settings.bank.instructions}
              onChange={(e) => handleChange("bank", "instructions", e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-amber-500 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-black hover:bg-amber-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50"
          >
            <FaSave size={15} />
            {saving ? "Saving Changes..." : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPayments;
