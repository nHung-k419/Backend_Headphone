import { Order } from "../models/Order.model.js";
import { CartItems } from "../models/Cart_items.model.js";
import { Cart } from "../models/Cart.model.js";
import { OrderItems } from "../models/OrderItems.model.js";
import moment from "moment";
import CryptoJS from "crypto-js";
import axios from "axios";
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
      const resultOrder = await CartItems.find({ Id_Cart: result._id }).populate("Id_Product");
      return res.status(200).json({ resultOrder });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const CreateOrder = async (req, res) => {
  let TotalAmount = 0;
  const { Id_Cart, idUser, Phone, Fullname, Address, PaymentMethod } = req.body;
  try {
    const CartItemsOrder = await CartItems.find({ Id_Cart: Id_Cart }).populate("Id_Product");
    const resultFind = await Cart.findOne({ Id_User: idUser });
    if (resultFind) {
      // const resultOrder = await CartItems.find({ Id_Cart: resultFind._id }).populate("Id_Product");
      TotalAmount = CartItemsOrder.reduce((sum, item) => {
        sum += item.Quantity * item?.Id_Product?.Price;
        return sum;
      }, 0);
    }

    const resultCreate = new Order({ Id_Cart, Id_User: idUser, Fullname, Phone, TotalAmount, PaymentMethod, Address });

    await resultCreate.save();
    const OrderItemsDate = CartItemsOrder.map((item) => ({
      Id_Order: resultCreate._id,
      Id_Product: item.Id_Product._id,
      Name: item.Id_Product.Name,
      Image: item.Image ? item.Image : item.Id_Product.ImageUrl.path,
      Size: item.Size,
      Color: item.Color,
      Quantity: item.Quantity,
    }));
    await OrderItems.insertMany(OrderItemsDate);
    // await CartItems.deleteMany({ Id_Cart: Id_Cart });
    return res.status(200).json({ resultCreate });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const paymentWithZalopay = async (req, res) => {
  let total = 0;
  const { Id_Cart, Id_User, Phone, Fullname, Address, _id, PaymentMethod } = req.body;
  const items = [{ Id_Cart, Id_User, Phone, Fullname, Address, PaymentMethod, _id }];
  const embed_data = {
    redirecturl: "http://localhost:5173/OrderItems",
  };
  // console.log(items);

  const result = await Cart.findOne({ Id_User: Id_User });
  if (result) {
    const resultOrder = await CartItems.find({ Id_Cart: result._id }).populate("Id_Product");
    total = resultOrder.reduce((sum, item) => {
      sum += item.Quantity * item?.Id_Product?.Price;
      return sum;
    }, 0);
  }
  if (total > 0) {
    await CartItems.deleteMany({ Id_Cart: Id_Cart });
  }

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
    callback_url: "https://128a74385527.ngrok-free.app/api/CallbackOrder",
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
      // console.log("dataJson", dataJson);

      console.log("update ticket's status = success where app_trans_id =", dataJson["app_trans_id"]);
      const data = JSON.parse(dataJson.item);
      // console.log("data", data);
      const result = await Order.updateOne({ _id: data[0]._id }, { $set: { Status: "Đã thanh toán" } });
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
  console.log(status);

  const query = Id_User && status !== "Đơn hàng" ? { Id_User, Status: status } : {};

  try {
    const userOrders = await Order.find(query).sort({ createdAt: -1 });
    // console.log('userOrders',userOrders);

    if (userOrders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    const allOrderItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await OrderItems.find({ Id_Order: order._id }).populate("Id_Product").populate("Id_Order");
        return {
          orderInfo: order,
          items,
        };
      })
    );

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
    const getAllOrder = await Order.find({}).sort({ createdAt: -1 });
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
