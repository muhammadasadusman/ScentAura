import { useEffect, useState } from "react";
import API from "../../services/api";

const AdminOrders = () => {

  const [orders, setOrders] = useState([]);
const [selectedOrder, setSelectedOrder] = useState(null);
const [showModal, setShowModal] = useState(false);

  const fetchOrders = async () => {
    try {

      const { data } = await API.get("/orders");
           console.log(data.map(order => order.status)); 
      setOrders(data);

    } catch (error) {

      console.log(error);

    }
  };


  useEffect(() => {
    fetchOrders();
  }, []);



  const updateStatus = async (id, status) => {
  try {

    await API.put(`/orders/${id}/status`, {
      status
    });

    setOrders(prev =>
      prev.map(order =>
        order._id === id
          ? { ...order, status: status }
          : order
      )
    );

  } catch(error) {
    console.log(error);
  }
};


    



  return (

    <div className="min-h-screen bg-gray-100 p-3 sm:p-5 lg:p-6 w-full">


      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-5 sm:mb-6">
        Admin Orders
      </h1>



      <div className="bg-white rounded-xl shadow overflow-hidden w-full">


             <div className="overflow-x-auto">

             <table className="w-full min-w-[1000px]">

          <thead className="bg-black text-white">

            <tr>

              <th className="p-4 text-left">
                Order ID
              </th>

              <th className="p-4 text-left">
                Customer
              </th>

              <th className="p-4 text-left">
                Products
              </th>

              <th className="p-4 text-left">
                Total
              </th>

              <th className="p-4 text-left">
               Payment
              </th>

              <th className="p-4 text-left">
                Date
               </th>

              <th className="p-4 text-left">
                Status
              </th>
              
                  <th className="p-4 text-left">
                  Details
                  </th>


            </tr>

          </thead>


<tbody>

{orders.length === 0 ? (

  <tr>
    <td colSpan="5" className="text-center py-10 text-gray-500">
      No Orders Found
    </td>
  </tr>

) : (

  orders.map((order) => (

    <tr
      key={order._id}
      className="border-b"
    >


              <td className="p-4 text-sm">

                {order._id.slice(-8)}

              </td>



              <td className="p-4">

                <p className="font-semibold">
                  {order.customerInfo.firstName} {order.customerInfo.lastName}
                </p>

                <p className="text-sm text-gray-500">
                  {order.customerInfo.contact}
                </p>

                <p className="text-sm text-gray-500">
                  {order.customerInfo.city}
                </p>

              </td>




              <td className="p-4">


              {order.products.map((item,index)=>(

                <div
                key={index}
                className="flex items-center gap-3 mb-2"
                >

                  <img
                  src={item.image}
                  className="w-12 h-12 rounded object-cover"
                  />


                  <div>

                    <p className="font-medium">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Rs. {item.price} × {item.quantity}
                    </p>

                  </div>


                </div>


              ))}


              </td>




              <td className="p-4 font-bold">

                Rs. {order.totalPrice}
                   
              </td>

                    <td className="p-4">
                   {order.paymentMethod}
                    </td>

              <td className="p-4">
             {new Date(order.createdAt).toLocaleDateString()}
             </td>


<td className="p-4">

  <div
    className={`rounded-lg font-semibold 
    ${
      order.status === "Pending"
        ? "bg-yellow-100 text-yellow-700"
        : order.status === "Processing"
        ? "bg-blue-100 text-blue-700"
        : order.status === "Shipped"
        ? "bg-purple-100 text-purple-700"
        : order.status === "Delivered"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >

    <select
      value={order.status}
      onChange={(e)=>updateStatus(order._id,e.target.value)}
      className="bg-transparent px-2 sm:px-3 py-2 outline-none font-semibold text-sm sm:text-base"
    >

      <option value="Pending">
        Pending
      </option>

      <option value="Processing">
        Processing
      </option>

      <option value="Shipped">
        Shipped
      </option>

      <option value="Delivered">
        Delivered
      </option>

      <option value="Cancelled">
        Cancelled
      </option>

    </select>

  </div>

</td>

           

                      <td className="p-4">
  <button
    onClick={() => {
      setSelectedOrder(order);
      setShowModal(true);
    }}
    className="bg-black text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base hover:bg-gray-800 transition whitespace-nowrap"
  >
    View
  </button>
</td>

               
                    
            </tr>


            ))

)}

</tbody>


        </table>
         </div>

      </div>


                       {showModal && selectedOrder && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

    <div className="bg-white rounded-xl w-full max-w-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto relative">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl sm:text-2xl font-bold">
          Order Details
        </h2>

        <button
          onClick={() => setShowModal(false)}
          className="text-red-500 font-bold text-xl"
        >
          ✕
        </button>

      </div>

      <h3 className="font-bold text-lg mb-2">
        Customer Information
      </h3>

      <p>
        <strong>Name:</strong> {selectedOrder.customerInfo.firstName} {selectedOrder.customerInfo.lastName}
      </p>

      <p>
        <strong>Contact:</strong> {selectedOrder.customerInfo.contact}
      </p>

      <p>
        <strong>Country:</strong> {selectedOrder.customerInfo.country}
      </p>

      <p>
        <strong>City:</strong> {selectedOrder.customerInfo.city}
      </p>

      <p>
        <strong>Address:</strong> {selectedOrder.customerInfo.address}
      </p>

      <hr className="my-5"/>

      <h3 className="font-bold text-lg mb-3">
        Products
      </h3>

      {selectedOrder.products.map((item,index)=>(

        <div
          key={index}
          className="flex items-center gap-3 sm:gap-4 border-b py-3"
        >

          <img
            src={item.image}
            className="w-16 h-16 rounded object-cover"
          />

          <div>

            <p className="font-semibold">
              {item.name}
            </p>

            <p>
              Rs. {item.price}
            </p>

            <p>
              Qty: {item.quantity}
            </p>

          </div>

        </div>

      ))}

      <h2 className="text-xl font-bold mt-6">
        Total: Rs. {selectedOrder.totalPrice}
      </h2>
        
               
                <div className="mt-6 flex justify-end sticky bottom-0 bg-white pt-3">

  <button
  onClick={() => setShowModal(false)}
  className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
>
  Close
</button>

</div>

    </div>

  </div>
)}



    </div>

  );

};


export default AdminOrders;