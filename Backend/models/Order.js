import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },

  customerInfo: {
    contact: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    apartment: {
      type: String,
    },

    city: {
      type: String,
      required: true,
    },

    postalCode: {
      type: String,
    }
  },


  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },

      name: String,

      image: String,

      price: Number,

      quantity: Number,
    }
  ],


  shippingPrice:{
    type:Number,
    default:200,
  },


  totalPrice:{
    type:Number,
    required:true,
  },


  paymentMethod:{
    type:String,
    default:"Cash On Delivery",
  },


  status:{
    type:String,
    default:"Pending",
    enum:[
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled"
    ]
  }


},
{
 timestamps:true
}
);


const Order = mongoose.model("Order",orderSchema);

export default Order;