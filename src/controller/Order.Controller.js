import { Order } from "../models/Order.model.js";
import { CartItems } from "../models/Cart_items.model.js";
import { Cart } from "../models/Cart.model.js";
import { OrderItems } from "../models/OrderItems.model.js";
import { Products } from "../models/Product.model.js";
import { Users } from "../models/User.model.js";
import { mailAcceptOrder } from "../services/AcceptOrder.js";
import moment from "moment";
import CryptoJS from "crypto-js";
import axios from "axios";
import { ProductVariants } from "../models/Product_Variants.js";
const config = {
  app_id: "2554",
  key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};
const getOrder = async (req, res) => {
  const { idUser } = req.params;
  try {
    // get cart by id user
    const result = await Cart.findOne({ Id_User: idUser });
    if (result) {
      const resultOrder = await CartItems.find({ Id_Cart: result._id }).populate({
        path: "Id_ProductVariants",
        model: "ProductVariants",
        populate: {
          path: "Id_Products",
          model: "Product",
        },
      });
      return res.status(200).json({ resultOrder });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const CreateOrder = async (req, res) => {
  // let TotalAmount = 0;
  const { Id_Cart, idUser, Phone, Fullname, Address,TotalAmount, PaymentMethod,voucherCode, Email } = req.body;
  // console.log("total", TotalAmount);

  try {
    const CartItemsOrder = await CartItems.find({ Id_Cart: Id_Cart }).populate({
      path: "Id_ProductVariants",
      model: "ProductVariants",
      populate: {
        path: "Id_Products",
        model: "Product",
      },
    });
    const resultFind = await Cart.findOne({ Id_User: idUser });
    // if (resultFind) {
    //   // const resultOrder = await CartItems.find({ Id_Cart: resultFind._id }).populate("Id_Product");
    //   TotalAmount = CartItemsOrder.reduce((sum, item) => {
    //     sum += item.Quantity * item?.Id_ProductVariants?.Price;
    //     return sum;
    //   }, 0);
    // }

    const resultCreate = new Order({ Id_Cart, Id_User: idUser, Fullname, Phone, TotalAmount,voucherCode, PaymentMethod, Address, Email });
    await resultCreate.save();
    const OrderItemsDate = CartItemsOrder.map((item) => ({
      Id_Order: resultCreate._id,
      Id_ProductVariants: item.Id_ProductVariants._id,
      Name: item?.Id_ProductVariants?.Id_Products?.Name,
      Image: item.Image,
      Size: item.Size,
      Price: item.Price,
      Color: item.Color,
      Quantity: item.Quantity,
    }));

    // console.log("OrderItemsDate", OrderItemsDate);

    await OrderItems.insertMany(OrderItemsDate);

    for (const items of CartItemsOrder) {
      await ProductVariants.updateOne({ _id: items.Id_ProductVariants._id }, { $inc: { Stock: -items.Quantity, Sold: items.Quantity } });
    }

    if (PaymentMethod === "COD") {
      await CartItems.deleteMany({ Id_Cart: Id_Cart });
      await mailAcceptOrder(Email, Fullname, resultCreate._id, resultCreate.CreateAt, OrderItemsDate, TotalAmount);
    }

    return res.status(200).json({ resultCreate });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const paymentWithZalopay = async (req, res) => {
  let total = 0;
  const { Id_Cart, Id_User, Phone, Fullname, Address, _id, PaymentMethod, Email } = req.body;
  const items = [{ Id_Cart, Id_User, Phone, Fullname, Address, PaymentMethod, _id, Email }];

  const embed_data = {
    redirecturl: "http://localhost:5173/OrderItems",
  };
  // console.log(items);

  const result = await Cart.findOne({ Id_User: Id_User });
  if (result) {
    const resultOrder = await CartItems.find({ Id_Cart: result._id }).populate("Id_ProductVariants");
    total = resultOrder.reduce((sum, item) => {
      sum += item.Quantity * item?.Id_ProductVariants?.Price;
      return sum;
    }, 0);
  }
  // if (total > 0) {
  //   await CartItems.deleteMany({ Id_Cart: Id_Cart });
  // }

  const transID = Math.floor(Math.random() * 1000000);
  const Headphone = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: "Nguyễn Ngọc Hùng",
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: total,
    description: `Zalo - Payment for the Headphone #${transID}`,
    bank_code: "",
    callback_url: "https://84a27c362b41.ngrok-free.app/api/CallbackOrder",
  };
  const data =
    config.app_id +
    "|" +
    Headphone.app_trans_id +
    "|" +
    Headphone.app_user +
    "|" +
    Headphone.amount +
    "|" +
    Headphone.app_time +
    "|" +
    Headphone.embed_data +
    "|" +
    Headphone.item;
  Headphone.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  try {
    const result = await axios.post(config.endpoint, null, { params: Headphone });
    res.status(200).send({ Message: result.data });
  } catch (error) {
    console.log(error);
  }
};
const Callback = async (req, res, next) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    // console.log("mac =", mac);

    // check callback valid (from to ZaloPay server)
    if (reqMac !== mac) {
      // callback not valid
      result.return_code = -1;
      result.return_message = "mac not equal";
      return req.json({ message: "Paytment not success" });
    } else {
      // payment success
      // merchant update status in order
      let dataJson = JSON.parse(dataStr, config.key2);

      console.log("update ticket's status = success where app_trans_id =", dataJson["app_trans_id"]);
      const data = JSON.parse(dataJson.item);
      // delete cartitem after callback succes
      await CartItems.deleteMany({ Id_Cart: data[0].Id_Cart });
      //  update status Order after callback success
      const result = await Order.updateOne({ _id: data[0]._id }, { $set: { StatusPayment: "Đã thanh toán" } });
      // send mail after order success
      const orderitems = await OrderItems.find({ Id_Order: data[0]._id }).populate("Id_Order");
      await mailAcceptOrder(
        data[0].Email,
        data[0].Fullname,
        orderitems.Id_Order._id,
        resultCreate.Id_Order.CreateAt,
        orderitems,
        resultCreate.Id_Order.TotalAmount
      );
      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server will call again three times ( maximum 3 times )
    result.return_message = ex.message;
  }
  // notify result to ZaloPay
  res.json(result);
};

const getOrderItems = async (req, res) => {
  const { Id_User } = req.params;
  const { status } = req.body;
  // console.log(status);

  const query = Id_User && status !== "Đơn hàng" ? { Id_User, Status: status } : { Id_User };

  try {
    const userOrders = await Order.find(query).sort({ CreateAt: -1 });
    // console.log('userOrders',userOrders);

    if (userOrders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    const allOrderItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await OrderItems.find({ Id_Order: order._id }).populate({
          path: "Id_ProductVariants",
          model: "ProductVariants",
          populate: {
            path: "Id_Products",
            model: "Product",
          },
        });
        return {
          orderInfo: order,
          items,
        };
      })
    );
    // console.log("allOrderItems", allOrderItems[0].orderInfo);

    setTimeout(() => {
      return res.status(200).json({ allOrderItems });
    }, 2000);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAddressOrder = async (req, res) => {
  const { Id_User } = req.params;
  try {
    const findAdressOrder = await Order.findOne({ Id_User: Id_User }).sort({ createdAt: -1 });
    return res.status(200).json({ findAdressOrder });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getStatusOrder = async (req, res) => {
  const { status } = req.params;
  try {
    const findStatusOrder = await Order.find({ Status: status }).sort({ createdAt: -1 });
    return res.status(200).json({ findStatusOrder });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const GetAllOrder = async (req, res) => {
  try {
    const getAllOrder = await Order.find({}).sort({ CreateAt: -1 });
    if (getAllOrder) {
      return res.status(200).json({ getAllOrder });
    }
    return res.status(404).json({ message: "Not founded order" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const GetAllOrderItems = async (req, res) => {
  try {
    const getAllOrderItems = await OrderItems.find().sort({ createdAt: -1 }).populate("Id_Order").populate("Id_Product");
    if (getAllOrderItems) {
      return res.status(200).json({ getAllOrderItems });
    }
    return res.status(404).json({ message: "Not founded order" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const updateStatusOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    if (status === "Xác nhận") {
      const result = await Order.updateOne({ _id: id }, { $set: { Status: "Chờ giao hàng" } });
      return res.status(200).json({ result });
    } else if (status === "Đã giao") {
      const result = await Order.findOne({ _id: id });
      if (result.Status === "Chờ giao hàng") {
        const result = await Order.updateOne({ _id: id }, { $set: { Status: "Đã giao" } });
        return res.status(200).json({ "update status": "success" });
      }
      return res.status(400).json({ "update status": "fail" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export {
  getOrder,
  CreateOrder,
  paymentWithZalopay,
  Callback,
  getOrderItems,
  getAddressOrder,
  GetAllOrder,
  GetAllOrderItems,
  updateStatusOrder,
};

// Headphone.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
