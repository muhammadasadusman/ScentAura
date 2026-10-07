import Order from "../models/Order.js";


// Create Order
export const createOrder = async (req, res) => {
  try {
    const {
      customerInfo,
      products,
      shippingPrice,
      totalPrice,
      paymentMethod,
      transactionId,
      paymentProof,
    } = req.body;

    const order = await Order.create({
      user: req.user ? req.user._id : undefined,
      customerInfo,
      products,
      shippingPrice: shippingPrice ?? 200,
      totalPrice,
      paymentMethod: paymentMethod || "Cash On Delivery",
      transactionId: transactionId || "",
      paymentProof: paymentProof || "",
      paymentStatus: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Order Created Successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Orders (Admin)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Order Fulfillment Status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: "Status Updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Order Payment Status (Admin)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.json({
      success: true,
      message: "Payment Status Updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
