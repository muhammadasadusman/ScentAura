import Message from "../models/Message.js";

// Customer sends message to Admin
export const createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, subject, message.",
      });
    }

    const newMessage = await Message.create({
      user: req.user ? req.user._id : undefined,
      name,
      email,
      phone: phone || "",
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Your message has been sent to ScentAura Concierge. We will get back to you shortly!",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin gets all messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    const unreadCount = messages.filter((m) => !m.isRead).length;

    res.status(200).json({
      success: true,
      unreadCount,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin toggles or marks message as read
export const markMessageRead = async (req, res) => {
  try {
    const { isRead } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    message.isRead = typeof isRead === "boolean" ? isRead : true;
    await message.save();

    res.status(200).json({
      success: true,
      message: "Message status updated",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin deletes a message
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
