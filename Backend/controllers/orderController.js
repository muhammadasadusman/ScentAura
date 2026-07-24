import Order from "../models/Order.js";


// Create Order
export const createOrder = async (req, res) => {

  try {

    const {
      customerInfo,
      products,
      shippingPrice,
      totalPrice,
      paymentMethod
    } = req.body;


    const order = await Order.create({

      customerInfo,

      products,

      shippingPrice,

      totalPrice,

      paymentMethod

    });


    res.status(201).json({
      message:"Order Created Successfully",
      order
    });


  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};



// Get All Orders (Admin ke liye)
export const getOrders = async (req,res)=>{

 try{

  const orders = await Order.find()
  .sort({createdAt:-1});


  res.json(orders);


 }catch(error){

  res.status(500).json({
    message:error.message
  });

 }

};



export const updateOrderStatus = async (req,res)=>{

  try{

    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if(!order){
      return res.status(404).json({
        message:"Order not found"
      });
    }


    order.status = status;

    await order.save();


    res.json({
      message:"Status Updated",
      order
    });


  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};
