import PaymentSetting from "../models/PaymentSetting.js";

// Helper to get or create singleton payment settings document
const getOrCreateSettings = async () => {
  let settings = await PaymentSetting.findOne();
  if (!settings) {
    settings = await PaymentSetting.create({
      easypaisa: {
        enabled: true,
        accountTitle: "ScentAura Store",
        accountNumber: "03001234567",
        instructions:
          "Send total amount to our EasyPaisa account, copy the Transaction ID (TID) or upload your screenshot below.",
      },
      jazzcash: {
        enabled: true,
        accountTitle: "ScentAura Store",
        accountNumber: "03007654321",
        instructions:
          "Send total amount to our JazzCash account, copy the Transaction ID (TID) or upload your screenshot below.",
      },
      bank: {
        enabled: true,
        bankName: "Meezan Bank",
        accountTitle: "ScentAura Luxury Perfumes",
        accountNumber: "01020304050607",
        iban: "PK00MEZN0000010203040506",
        instructions:
          "Transfer total order amount to our bank account via online banking/ATM and submit the reference or receipt.",
      },
    });
  }
  return settings;
};

// Public endpoint for customer checkout
export const getPublicPaymentSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    // Return enabled payment options
    res.status(200).json({
      success: true,
      data: {
        easypaisa: settings.easypaisa,
        jazzcash: settings.jazzcash,
        bank: settings.bank,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin endpoint to view full settings
export const getAdminPaymentSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin endpoint to update settings
export const updatePaymentSettings = async (req, res) => {
  try {
    const { easypaisa, jazzcash, bank } = req.body;
    let settings = await PaymentSetting.findOne();

    if (!settings) {
      settings = new PaymentSetting();
    }

    if (easypaisa) {
      settings.easypaisa = {
        ...settings.easypaisa,
        ...easypaisa,
      };
    }

    if (jazzcash) {
      settings.jazzcash = {
        ...settings.jazzcash,
        ...jazzcash,
      };
    }

    if (bank) {
      settings.bank = {
        ...settings.bank,
        ...bank,
      };
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Payment settings updated successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
