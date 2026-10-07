import mongoose from "mongoose";

const paymentSettingSchema = new mongoose.Schema(
  {
    easypaisa: {
      enabled: { type: Boolean, default: true },
      accountTitle: { type: String, default: "ScentAura Store" },
      accountNumber: { type: String, default: "03001234567" },
      instructions: {
        type: String,
        default:
          "Send total amount to our EasyPaisa account, copy the Transaction ID (TID) or upload your screenshot below.",
      },
    },

    jazzcash: {
      enabled: { type: Boolean, default: true },
      accountTitle: { type: String, default: "ScentAura Store" },
      accountNumber: { type: String, default: "03007654321" },
      instructions: {
        type: String,
        default:
          "Send total amount to our JazzCash account, copy the Transaction ID (TID) or upload your screenshot below.",
      },
    },

    bank: {
      enabled: { type: Boolean, default: true },
      bankName: { type: String, default: "Meezan Bank" },
      accountTitle: { type: String, default: "ScentAura Luxury Perfumes" },
      accountNumber: { type: String, default: "01020304050607" },
      iban: { type: String, default: "PK00MEZN0000010203040506" },
      instructions: {
        type: String,
        default:
          "Transfer total order amount to our bank account via online banking/ATM and submit the reference or receipt.",
      },
    },
  },
  {
    timestamps: true,
  }
);

const PaymentSetting = mongoose.model("PaymentSetting", paymentSettingSchema);

export default PaymentSetting;
