import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";


const Cart = () => {
const navigate = useNavigate();

  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty
  } = useContext(CartContext);

console.log(JSON.stringify(cart, null, 2));

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );



 if(cart.length === 0){

  return (
    <div className="
      flex
flex-col
md:flex-row
items-center
justify-between
gap-5
bg-white
shadow-xl
rounded-2xl
p-6
border
border-gray-100
hover:shadow-2xl
transition
    ">

      <div className="text-7xl mb-5">
        🛒
      </div>


      <h1 className="
        text-3xl
        sm:text-4xl
        font-bold
        mb-4
      ">
        Your Cart is Empty
      </h1>


      <p className="
        text-gray-500
        max-w-md
        mb-8
      ">
        Looks like you haven't added any perfumes yet.
        Explore our luxury collection and find your signature scent.
      </p>


      <button
        onClick={() => navigate("/perfumes")}
        className="
          bg-yellow-500
          hover:bg-yellow-600
          text-black
          font-semibold
          px-8
          py-3
          rounded-lg
          transition
        "
      >
        Continue Shopping
      </button>


    </div>
  );

}



  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">


      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10">
        Shopping Cart
      </h1>



      <div className="space-y-5">


        {cart.map((item)=>(

          <div
            key={item._id}
            className="
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-5
            bg-white
            shadow-lg
            rounded-xl
            p-5
            "
          >


            <div className="flex items-center gap-5">

              <img
                src={item.image}
                alt={item.name}
                className="
                 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-2xl shadow-md"
              />


              <div>

                <h2 className="font-bold text-lg">
                  {item.name}
                </h2>


                <p className="text-yellow-600 font-bold">
                  Rs. {item.price}
                </p>

              </div>

            </div>



            {/* Quantity */}

            <div className="flex items-center gap-3">

              <button
               onClick={()=>decreaseQty(item._id)}
               className="
                 w-9
                  h-9
               rounded-full
                  bg-black
                 text-yellow-500
                    font-bold
                   text-xl
                  hover:bg-yellow-500
                    hover:text-black
                    transition
                      "
                     >
                      - 
                     </button>


              <span className="font-bold">
                {item.quantity}
              </span>


                         <button
              onClick={()=>increaseQty(item._id)}
              className="
              w-9
               h-9
                rounded-full
               bg-yellow-500
                text-black
                 font-bold
                  text-xl
                hover:bg-yellow-400
                   transition
                   "
                  >
                    +
                    </button>

            </div>



            <button
              onClick={()=>removeFromCart(item._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Remove
            </button>


          </div>

        ))}


      </div>




      <div className="mt-10 text-right">


        <h2 className="text-2xl font-bold">
          Total: Rs. {total}
        </h2>


        <button
  onClick={() => navigate("/checkout")}
  className="
  mt-5
  bg-black
  text-white
  px-8
  py-3
  rounded-lg
  hover:bg-gray-800
  transition
  "
>
  Proceed to Checkout
</button>


      </div>



    </div>

  );

};


export default Cart;