import { useEffect, useState } from "react";
import API from "../../services/api";

const AdminDashboard = () => {

  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    users: 0,
    revenue: 0,
    pending: 0,
    delivered: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);


  const fetchDashboard = async () => {

    try {

      const ordersRes = await API.get("/orders");
 headers:{
  Authorization:`Bearer ${localStorage.getItem("token")}`
 }
      const productsRes = await API.get("/products");
        
      const usersRes = await API.get("/users", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

      const orders = ordersRes.data;


      const revenue = orders.reduce(
        (total, order) => total + order.totalPrice,
        0
      );


      const pending = orders.filter(
        order => order.status === "Pending"
      ).length;


      const delivered = orders.filter(
        order => order.status === "Delivered"
      ).length;



      setStats({

        orders: orders.length,

        products: productsRes.data.length,

        users: usersRes.data.length,

        revenue,

        pending,

        delivered,

      });


      setRecentOrders(
        orders.slice(0,5)
      );


    } catch(error){

      console.log(
        "Dashboard Error:",
        error
      );

    }

  };



  useEffect(()=>{

    fetchDashboard();

  },[]);



  return (

    <div className="w-full">


      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        Admin Dashboard
      </h1>



      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">


        <div className="bg-white p-4 sm:p-6 rounded-xl shadow">

          <p className="text-gray-500">
            Total Orders
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {stats.orders}
          </h2>

        </div>



        <div className="bg-white p-4 sm:p-6 rounded-xl shadow">

          <p className="text-gray-500">
            Total Products
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {stats.products}
          </h2>

        </div>



        <div className="bg-white p-4 sm:p-6 rounded-xl shadow">

          <p className="text-gray-500">
            Total Revenue
          </p>

          <h2 className="text-3xl font-bold mt-2">
            Rs. {stats.revenue}
          </h2>

        </div>



        <div className="bg-white p-4 sm:p-6 rounded-xl shadow">

          <p className="text-gray-500">
            Pending Orders
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {stats.pending}
          </h2>

        </div>



        <div className="bg-white p-4 sm:p-6 rounded-xl shadow">

          <p className="text-gray-500">
            Delivered Orders
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {stats.delivered}
          </h2>

        </div>


        <div className="bg-white p-4 sm:p-6 rounded-xl shadow">

          <p className="text-gray-500">
            Total Users
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {stats.users}
          </h2>

        </div>


      </div>



      <div className="bg-white rounded-xl shadow mt-8 sm:mt-10 p-4 sm:p-6">


        <h2 className="text-xl sm:text-2xl font-bold mb-5">
          Recent Orders
        </h2>



        <div className="space-y-4">


        {recentOrders.map(order=>(

          <div
          key={order._id}
          className="border-b pb-3 flex flex-col sm:flex-row sm:justify-between gap-3"
          >


            <div>

              <p className="font-semibold">
                {order.customerInfo.firstName} {order.customerInfo.lastName}
              </p>

              <p className="text-sm text-gray-500">
                {order.products[0]?.name}
              </p>

            </div>


            <div>

              <p className="font-bold">
                Rs. {order.totalPrice}
              </p>

              <span
  className={`inline-block mt-1 px-3 py-1 rounded-md text-sm font-semibold
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
  {order.status}
</span>

            </div>


          </div>

        ))}


        </div>


      </div>


    </div>

  );

};


export default AdminDashboard;