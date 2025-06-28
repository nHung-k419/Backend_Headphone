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
  const { Id_Cart, idUser, Sex, Phone, Fullname, CCCD, Address, PaymentMethod } = req.body;
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
    const resultCreate = new Order({ Id_Cart, Id_User: idUser, Fullname, Sex, Phone, CCCD, TotalAmount, PaymentMethod, Address });

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
    await CartItems.deleteMany({ Id_Cart: Id_Cart });
    return res.status(200).json({ resultCreate });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const paymentWithZalopay = async (req, res) => {
  let total = 0;
  const { Id_Cart, Id_User, Sex, Phone, Fullname, CCCD, Address, _id, PaymentMethod } = req.body;
  const items = [{ Id_Cart, Id_User, Sex, Phone, Fullname, CCCD, Address, PaymentMethod, _id }];
  const embed_data = {
    redirecturl: "http://localhost:5173/OrderItems",
  };

  const result = await Cart.findOne({ Id_User: Id_User });
  if (result) {
    const resultOrder = await CartItems.find({ Id_Cart: result._id }).populate("Id_Product");
    total = resultOrder.reduce((sum, item) => {
      sum += item.Quantity * item?.Id_Product?.Price;
      return sum;
    }, 0);
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
    callback_url: "https://20cb-42-115-181-237.ngrok-free.app/api/CallbackOrder",
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

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
      return req.json({ message: "Paytment not success" });
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
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
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
};

const getOrderItems = async (req, res) => {
  const { Id_User } = req.params;
  try {
    const findOrder = await Order.findOne({ Id_User: Id_User });
    const OrderItemsProduct = await OrderItems.find({ Id_Order: findOrder._id }).populate("Id_Product").populate("Id_Order");
    return res.status(200).json({ OrderItemsProduct });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export { getOrder, CreateOrder, paymentWithZalopay, Callback,getOrderItems };

// Headphone.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
