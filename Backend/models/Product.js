import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

        image2: {
        type: String,
         default: "",
         },

    category: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Unisex"],
    },

    brand: {
      type: String,
      required: true,
    },

    size: {
      type: String,
      default: "100ml",
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        comment: String,

        rating:  {
  type: Number,
  min: 1,
  max: 5,
},
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;