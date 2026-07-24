import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";

const AdminProducts = () => {
     const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const [showForm, setShowForm] = useState(false);
const [isEdit, setIsEdit] = useState(false);

const [formData, setFormData] = useState({
  name: "",
  description: "",
  price: "",
  image: "",
  image2:"",
  category: "Men",
  brand: "",
  size: "100ml",
  stock: "",
});

  const fetchProducts = async () => {
    try {

      const {data} = await API.get("/products");

      setProducts(data);

    } catch(error){

      console.log(error);

    }
  };


  useEffect(()=>{

    fetchProducts();

  },[]);



  const deleteProduct = async(id)=>{

    try{

      await API.delete(`/products/${id}`);

      fetchProducts();

    }catch(error){

      console.log(error);

    }

  };



const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (isEdit) {
      await API.put(`/products/${formData._id}`, formData);
    } else {
      await API.post("/products", formData);
    }

    fetchProducts();

    setShowForm(false);
    setIsEdit(false);

    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      image2: "",
      category: "Men",
      brand: "",
      size: "100ml",
      stock: "",
    });

  } catch (error) {
    console.log("UPLOAD FRONTEND ERROR:", error.response?.data || error.message);
  }
};

const editProduct = (product) => {
  setFormData(product);
  setIsEdit(true);
  setShowForm(true);
};



const handleImageChange = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await API.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setFormData((prev) => ({
      ...prev,
      image: data.imageUrl,
    }));

    console.log("Uploaded Image:", data.imageUrl);

  } catch (error) {
    console.log(error);
    alert("Image upload failed");
  }
};



const handleImage2Change = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await API.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setFormData((prev) => ({
      ...prev,
      image2: data.imageUrl,
    }));

    console.log("Uploaded Image 2:", data.imageUrl);

  } catch (error) {
    console.log(error);
    alert("Second image upload failed");
  }
};



  return (

    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">


      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">




        {showForm && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
    <form
  onSubmit={handleSubmit}
  className="bg-white w-full max-w-[500px] max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6 space-y-4"
    >
      <h2 className="text-2xl font-bold">
        {isEdit ? "Edit Product" : "Add Product"}
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        type="text"
        name="brand"
        placeholder="Brand"
        value={formData.brand}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={formData.stock}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

     <input
  type="file"
  accept="image/*"
  onChange={handleImageChange}
  className="w-full border p-3 rounded"
/>

{formData.image && (
  <img
    src={formData.image}
    alt="Preview"
    className="w-40 h-40 object-cover rounded-lg border"
  />
)}

<input
  type="file"
  accept="image/*"
  onChange={handleImage2Change}
  className="w-full border p-3 rounded"
/>

{formData.image2 && (
  <img
    src={formData.image2}
    alt="Preview 2"
    className="w-40 h-40 object-cover rounded-lg border"
  />
)}

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      >
        <option>Men</option>
        <option>Women</option>
        <option>Unisex</option>
      </select>

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="bg-gray-500 text-white px-5 py-2 rounded"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="bg-black text-white px-5 py-2 rounded"
        >
          {isEdit ? "Update" : "Add Product"}
        </button>
      </div>
    </form>
  </div>
)}



<div>
  <button
    onClick={() => navigate("/admin")}
   className=" mb-4
      bg-blue-700 
      text-white 
      px-4 sm:px-6 
      py-2 sm:py-3 
      rounded-xl 
      text-sm sm:text-base 
      font-semibold
      shadow-md
      hover:bg-blue-800
      transition
      w-full sm:w-auto "
  >
  Dashboard
  </button>

  <h1 className="text-3xl font-bold">
    Admin Products
  </h1>
</div>
        


        <button
onClick={() => {
  setShowForm(true);
  setIsEdit(false);

  setFormData({
    name: "",
    description: "",
    price: "",
    image: "",
    image2: "",
    category: "Men",
    brand: "",
    size: "100ml",
    stock: "",
  });
}}
className="bg-black text-white px-5 py-3 rounded-xl w-full sm:w-auto"
>
  Add Product
</button>


      </div>



      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">


      {products.map(product=>(


        <div
        key={product._id}
        className="bg-white rounded-xl shadow p-5"
        >


          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 group">

  <img
    src={product.image}
    alt={product.name}
    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:opacity-0 group-hover:scale-105"
  />

  {product.image2 && (
    <img
      src={product.image2}
      alt={product.name}
      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
    />
  )}

</div>


          <h2 className="font-bold text-xl mt-4">
            {product.name}
          </h2>


          <p className="text-gray-500">
            {product.brand}
          </p>


          <p className="font-bold mt-2">
            Rs. {product.price}
          </p>


          <p>
            Stock: {product.stock}
          </p>


          <div className="flex gap-3 mt-5">


            <button
onClick={() => editProduct(product)}
className="bg-yellow-500 px-4 py-2 rounded-lg"
>
  Edit
</button>


            <button
            onClick={()=>deleteProduct(product._id)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Delete
            </button>


          </div>


        </div>


      ))}


      </div>


    </div>

  );

};


export default AdminProducts;