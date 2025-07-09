import { Cart } from "../models/Cart.model.js";
import { CartItems } from "../models/Cart_items.model.js";
import { Products } from "../models/Product.model.js";
const AddCart = async (req, res) => {
  const { idUser } = req.params;
  const { Id_Product, quantity, Size, Color, Image } = req.body;
  
  try {
    // get cart by user
    const cart = await Cart.findOne({ Id_User: idUser });

    if (!cart) {
      // saved to database cart
      const result = new Cart({ Id_User: idUser });
      const cart = await result.save();
      // console.log(cart);
      if(cart){
        const Cartitems = new CartItems({
          Id_Cart: cart._id,
          Id_Product: Id_Product,
          Size: Size,
          Color: Color,
          Quantity: quantity,
          Image: Image,
        });
        await Cartitems.save();
      }
    }
    // console.log('đã tồn tại');
    
    const isCheckExitsProduct = await CartItems.findOne({ Id_Product: Id_Product, Color: Color,Id_Cart: cart._id });
    // console.log(isCheckExitsProduct);
    if (isCheckExitsProduct) {
      await CartItems.updateOne({ Id_Product: Id_Product, Id_Cart: cart._id, Color: Color }, { $inc: { Quantity: 1 } });
      return res.status(201).json({ message: "Cart created successfully" });
    } else {
      const Cartitems = new CartItems({
        Id_Cart: cart._id,
        Id_Product: Id_Product,
        Size: Size,
        Color: Color,
        Quantity: quantity,
        Image: Image,
      });
    const resultItem =  await Cartitems.save();
    // console.log(resultItem);
    
      return res.status(201).json({ message: "Cart created successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const GetCartByUser = async (req, res) => {
  const { idUser } = req.params;
  // console.log(idUser);
  
  try {
    // get cart by id user
    const result = await Cart.findOne({ Id_User: idUser });
    
    if (result) {
      // get cart items from linked document product
      const resultCartItems = await CartItems.find({ Id_Cart: result._id }).populate("Id_Product");
      // console.log(resultCartItems);
      
      if (resultCartItems) {
        return res.status(200).json({ resultCartItems });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handlePrevious = async (req, res) => {
  const { Id_Product, Id_Cart, Color } = req.body;

  try {
    const result = await CartItems.updateOne(
      {
        Id_Cart,
        Id_Product,
        Color,
        Quantity: { $gt: 1 },
      },
      { $inc: { Quantity: -1 } }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "Không thể giảm dưới 1 hoặc không tìm thấy item" });
    }
    return res.status(200).json({ message: "Giảm số lượng thành công" });
  } catch (err) {
    console.error("Lỗi handlePrevious:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const handleNext = async (req, res) => {
  const { Id_Product, Id_Cart, Color } = req.body;
  try {
    await CartItems.updateOne({ Id_Cart, Id_Product, Color }, { $inc: { Quantity: 1 } });

    return res.status(200).json({ message: "Tăng số lượng thành công" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handleDlCartItem = async (req, res) => {
  const { Id_Product, Id_Cart, Color } = req.body;
  try {
    await CartItems.deleteOne({ Id_Cart, Id_Product, Color });
    return res.status(200).json({ message: "Xóa thành công!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export { AddCart, GetCartByUser, handlePrevious, handleNext,handleDlCartItem };
