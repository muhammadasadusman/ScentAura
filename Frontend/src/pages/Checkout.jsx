import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { FaCheckCircle } from "react-icons/fa";
import API from "../services/api";

const Checkout = () => {
  const { cart,clearCart } = useContext(CartContext);


  const shipping = 200;

 const subtotal = cart.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);

  const total = subtotal + shipping;

  const [formData, setFormData] = useState({
    contact: "",
    country: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    whatsapp: true,
    saveInfo: false,
    billing: "same",
  });
   const [errors, setErrors] = useState({});
   const [orderSuccess, setOrderSuccess] = useState(false);
   const [showReview, setShowReview] = useState(false);


 const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setFormData({
    ...formData,
    [name]: type === "checkbox" ? checked : value,
  });

  if (errors[name]) {
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }
};



const validateForm = () => {
  let newErrors = {};
  if (!formData.country.trim())
  newErrors.country = "Country is required.";

  if (!formData.contact.trim())
    newErrors.contact = "Email or Mobile Number is required.";

  if (!formData.firstName.trim())
    newErrors.firstName = "First Name is required.";

  if (!formData.lastName.trim())
    newErrors.lastName = "Last Name is required.";

  if (!formData.address.trim())
    newErrors.address = "Address is required.";

  if (!formData.city.trim())
    newErrors.city = "City is required.";

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};



const placeOrder = async () => {
  try {

    const orderData = {
      customerInfo: formData,
      products: cart.map((item)=>({
       name:item.name,
       image:item.image,
       price:item.price,
        quantity:item.quantity,
         })),
      shippingPrice: shipping,
      totalPrice: total,
      paymentMethod: "Cash On Delivery",
    };


    const { data } = await API.post("/orders", orderData);


    console.log("Order Created:", data);


    clearCart();
    setShowReview(false);
    setOrderSuccess(true);


  } catch (error) {

    console.log(
      "Order Error:",
      error.response?.data || error.message
    );

  }
};


if (showReview) {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Review Your Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-5 md:p-8">

            <h2 className="text-2xl font-bold mb-6">
              Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">Contact</p>
                <h3 className="font-semibold break-all">
                  {formData.contact}
                </h3>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">Country</p>
                <h3 className="font-semibold">
                  {formData.country}
                </h3>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">
                  First Name
                </p>

                <h3 className="font-semibold">
                  {formData.firstName}
                </h3>

              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">
                  Last Name
                </p>

                <h3 className="font-semibold">
                  {formData.lastName}
                </h3>

              </div>

              <div className="sm:col-span-2 bg-gray-50 rounded-xl p-4">

                <p className="text-gray-500 text-sm">
                  Address
                </p>

                <h3 className="font-semibold">
                  {formData.address}
                </h3>

              </div>

              <div className="bg-gray-50 rounded-xl p-4">

                <p className="text-gray-500 text-sm">
                  Apartment
                </p>

                <h3 className="font-semibold">

                  {formData.apartment || "N/A"}

                </h3>

              </div>

              <div className="bg-gray-50 rounded-xl p-4">

                <p className="text-gray-500 text-sm">
                  City
                </p>

                <h3 className="font-semibold">
                  {formData.city}
                </h3>

              </div>

              <div className="bg-gray-50 rounded-xl p-4">

                <p className="text-gray-500 text-sm">
                  Postal Code
                </p>

                <h3 className="font-semibold">
                  {formData.postalCode || "N/A"}
                </h3>

              </div>

              <div className="bg-gray-50 rounded-xl p-4">

                <p className="text-gray-500 text-sm">
                  Shipping
                </p>

                <h3 className="font-semibold">
                  Standard Shipping
                </h3>

              </div>

              <div className="bg-gray-50 rounded-xl p-4">

                <p className="text-gray-500 text-sm">
                  Payment
                </p>

                <h3 className="font-semibold">
                  Cash On Delivery
                </h3>

              </div>

            </div>

          </div>


                            {/* RIGHT */}

          <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 h-fit lg:sticky lg:top-24">

            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            <div className="space-y-5">

              {cart.map((item) => (

                <div
                  key={item._id}
                  className="flex items-center gap-4 border-b pb-4"
                >

                  <div className="relative">

                    <img
                      src={item.image}
                      alt={item.name}
                      className=" w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border"
                    />

                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">

                      {item.quantity}

                    </span>

                  </div>

                  <div className="flex-1">

                    <h3 className="font-semibold">

                      {item.name}

                    </h3>

                    <p className="text-sm text-gray-500">

                      {item.category}

                    </p>

                  </div>

                  <span className="font-bold">

                    Rs. {item.price * item.quantity}

                  </span>

                </div>

              ))}

            </div>

            <div className="space-y-3 mt-8">

              <div className="flex justify-between">

                <span>Subtotal</span>

                <span>Rs. {subtotal}</span>

              </div>

              <div className="flex justify-between">

                <span>Shipping</span>

                <span>Rs. {shipping}</span>

              </div>

              <hr />

              <div className="flex justify-between text-2xl font-bold">

                <span>Total</span>

                <span>Rs. {total}</span>

              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">

              <button
                onClick={() => setShowReview(false)}
                className="border-2 border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                Back
              </button>

                  <button
                  onClick={placeOrder}
                 className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition"
                 >
              Confirm Order
            </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


if (orderSuccess) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="relative bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">

        <button
          onClick={() => window.location.href = "/"}
          className="absolute top-4 right-4 text-red-500 text-2xl font-bold hover:text-red-700"
        >
          ✕
        </button>

        <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center">

          <span className="text-6xl text-green-600">
            ✓
          </span>

        </div>

        <h2 className="text-3xl font-bold text-green-600 mt-6">
          Order Placed Successfully!
        </h2>

        <p className="text-gray-600 mt-4 leading-7">

          Thank you for shopping with <b>ScentAura</b>.

          <br /><br />

          Your order has been received successfully.

        </p>

        <button
          onClick={() => window.location.href = "/"}
          className="mt-8 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
        >
          Continue Shopping
        </button>

      </div>

    </div>
  );
}

  return (

    <div className="bg-gray-100 min-h-screen py-10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <h1 className="text-4xl font-bold text-center mb-10">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 sm:p-8">

            {/* CONTACT */}

            <h2 className="text-2xl font-bold mb-5">
              Contact
            </h2>

           
           <input
           type="text"
             name="contact"
          value={formData.contact}
              onChange={handleChange}
              placeholder="Email or Mobile Phone Number"
               className={`w-full rounded-lg px-4 py-3 outline-none ${
                 errors.contact
                  ? "border-2 border-red-500"
                : "border focus:border-yellow-500"
                 }`}
              />

        {errors.contact && (
              <p className="text-red-500 text-sm mt-2">
            {errors.contact}
          </p>
         )}

            <label className="flex items-center gap-3 mt-5 cursor-pointer">

             

              <span className="flex items-center gap-2">

                <FaCheckCircle className="text-green-600" />

                Get order updates on WhatsApp

              </span>

            </label>

            {/* DELIVERY */}

            <h2 className="text-2xl font-bold mt-10 mb-5">
              Delivery
            </h2>

            <label className="font-semibold mb-2 block">
              Country / Region
            </label>

            <select
  name="country"
  value={formData.country}
  onChange={handleChange}
  className={`w-full rounded-lg px-4 py-3 outline-none ${
    errors.country
      ? "border-2 border-red-500"
      : "border focus:border-yellow-500"
  }`}
>
  <option value="">Select Country</option>
  <option value="Pakistan">Pakistan</option>
  <option value="India">India</option>
  <option value="United Arab Emirates">United Arab Emirates</option>
  <option value="Saudi Arabia">Saudi Arabia</option>
  <option value="United Kingdom">United Kingdom</option>
  <option value="United States">United States</option>
  <option value="Canada">Canada</option>
  <option value="Australia">Australia</option>
</select>

{errors.country && (
  <p className="text-red-500 text-sm mt-2">
    {errors.country}
  </p>
)}

            <div className="grid md:grid-cols-2 gap-5 mt-5">

              <input
  type="text"
  name="firstName"
  value={formData.firstName}
  onChange={handleChange}
  placeholder="First Name"
  className={`border rounded-lg px-4 py-3 outline-none ${
    errors.firstName
      ? "border-red-500 border-2"
      : "focus:border-yellow-500"
  }`}
/>

{errors.firstName && (
  <p className="text-red-500 text-sm mt-2">
    {errors.firstName}
  </p>
)}

           <input
  type="text"
  name="lastName"
  value={formData.lastName}
  onChange={handleChange}
  placeholder="Last Name"
  className={`border rounded-lg px-4 py-3 outline-none ${
    errors.lastName
      ? "border-red-500 border-2"
      : "focus:border-yellow-500"
  }`}
/>

{errors.lastName && (
  <p className="text-red-500 text-sm mt-2">
    {errors.lastName}
  </p>
)}

            </div>

           <input
  type="text"
  name="address"
  value={formData.address}
  onChange={handleChange}
  placeholder="Address"
  className={`w-full rounded-lg px-4 py-3 outline-none mt-5 ${
    errors.address
      ? "border-red-500 border-2"
      : "border focus:border-yellow-500"
  }`}
/>

{errors.address && (
  <p className="text-red-500 text-sm mt-2">
    {errors.address}
  </p>
)}

            <input
              type="text"
              name="apartment"
              value={formData.apartment}
              onChange={handleChange}
              placeholder="Apartment, suite, etc. (optional)"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-yellow-500 mt-5"
            />

            <div className="grid md:grid-cols-2 gap-5 mt-5">

             <input
  type="text"
  name="city"
  value={formData.city}
  onChange={handleChange}
  placeholder="City"
  className={`border rounded-lg px-4 py-3 outline-none ${
    errors.city
      ? "border-red-500 border-2"
      : "focus:border-yellow-500"
  }`}
/>

{errors.city && (
  <p className="text-red-500 text-sm mt-2">
    {errors.city}
  </p>
)}

              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal Code (optional)"
                className="border rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
              />

            </div>

            <label className="flex items-center gap-3 mt-6 cursor-pointer">

              

              <span className="flex items-center gap-2">

                <FaCheckCircle className="text-green-600" />

                Save this information for next time

              </span>

            </label>

            

               {/* SHIPPING */}

               <h2 className="text-2xl font-bold mt-10 mb-5">
               Shipping Method
             </h2>

          <div className="border rounded-xl p-5 flex items-center justify-between bg-gray-50">

               <div>

             <h3 className="font-semibold">
              Standard Shipping
              </h3>

                <p className="text-sm text-gray-500">
                    Delivery within 3–5 business days.
                 </p>

            </div>

              <span className="font-bold text-lg">
                   Rs. 200
                </span>

              </div>

{/* PAYMENT */}

<h2 className="text-2xl font-bold mt-10">
  Payment
</h2>

<p className="text-gray-500 mt-2 mb-5">
  All transactions are secure and encrypted.
</p>

<div className="border rounded-xl overflow-hidden">

  <div className="flex items-center gap-3 bg-yellow-50 border-b px-5 py-4">

    <input
      type="radio"
      checked
      readOnly
      className="accent-green-600"
    />

    <span className="font-semibold">
      Cash on Delivery (COD)
    </span>

  </div>

  <div className="bg-gray-50 px-5 py-4 text-gray-600">

    Pay in cash when your order is delivered.

  </div>

</div>

{/* BILLING ADDRESS */}

<h2 className="text-2xl font-bold mt-10 mb-5">
  Billing Address
</h2>

<div className="border rounded-xl overflow-hidden">

  <label className="flex items-center gap-3 px-5 py-4 border-b cursor-pointer">

    <input
      type="radio"
      name="billing"
      value="same"
      checked={formData.billing === "same"}
      onChange={handleChange}
      className="accent-green-600"
    />

    Same as shipping address

  </label>

  <label className="flex items-center gap-3 px-5 py-4 cursor-pointer">

    <input
      type="radio"
      name="billing"
      value="different"
      checked={formData.billing === "different"}
      onChange={handleChange}
      className="accent-green-600"
    />

    Use a different billing address

  </label>

</div>





          </div>


<div className="bg-white rounded-2xl shadow-lg p-6 h-fit lg:sticky lg:top-24">

  <h2 className="text-2xl font-bold mb-6">
    Order Summary
  </h2>

  {cart.length === 0 ? (

    <p className="text-gray-500">
      Your cart is empty.
    </p>

  ) : (

    <>
      <div className="space-y-5">

        {cart.map((item) => (

          <div
            key={item._id}
            className="flex items-center justify-between gap-4 border-b pb-4"
          >

            <div className="flex items-center gap-3">

              <img
                src={item.image}
                alt={item.name}
                className=" w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border"
              />

              <div>

                <h3 className="font-semibold text-sm">
                  {item.name}
                </h3>

                <p className="text-xs text-gray-500">
                  {item.category}
                </p>

              </div>

            </div>

            <span className="font-bold">
              Rs. {item.price * item.quantity}
            </span>

          </div>

        ))}

      </div>

      <div className="space-y-3 mt-6">

        <div className="flex justify-between">

          <span>Subtotal</span>

          <span>Rs. {subtotal}</span>

        </div>

        <div className="flex justify-between">

          <span>Shipping</span>

          <span>Rs. {shipping}</span>

        </div>

        <hr />

        <div className="flex justify-between text-xl font-bold">

          <span>Total</span>

          <span>Rs. {total}</span>

        </div>

      </div>

      <button
  onClick={() => {
  if (validateForm()) {
    setShowReview(true);
  }
}}
  className="w-full mt-8 bg-yellow-500 hover:bg-yellow-600 transition py-4 rounded-xl font-bold text-lg"
>
  Complete Order
</button>

    </>

  )}

</div>



        </div>

      </div>

    </div>
  );
};

export default Checkout;



