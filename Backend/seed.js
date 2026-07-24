import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import products from "./data/products.js";

dotenv.config();


const seedProducts = async () => {

try {

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB Connected");


await Product.deleteMany();

await Product.insertMany(
  products.map((product) => ({
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
    brand: "ScentAura",
    size: "100ml",
    stock: 10,
    rating: product.rating,
  }))
);


console.log("Products Added Successfully");


process.exit();

} catch(error){

console.log(error);
process.exit(1);

}

};


seedProducts();