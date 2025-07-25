import { Cart } from "../models/Cart.model.js";
import { CartItems } from "../models/Cart_items.model.js";
import { Products } from "../models/Product.model.js";
const AddCart = async (req, res) => {
  const { idUser } = req.params;
  const { Id_ProductVariants, quantity, Size, Color, Image, Price } = req.body;
  try {
    // get cart by user
    const cart = await Cart.findOne({ Id_User: idUser });

    if (!cart) {
      // saved to database cart
      const result = new Cart({ Id_User: idUser });
      const cart = await result.save();
      if (cart) {
        const Cartitems = new CartItems({
          Id_Cart: cart._id,
          Id_ProductVariants: Id_ProductVariants,
          Size: Size,
          Color: Color,
          Price: Price,
          Quantity: quantity,
          Image: Image,
        });
       const abc= await Cartitems.save();
      //  console.log('abc',abc);
       
      }
    }
    const isCheckExitsProduct = await CartItems.findOne({ Id_ProductVariants: Id_ProductVariants, Color: Color, Id_Cart: cart._id });
    // console.log(isCheckExitsProduct);
    if (isCheckExitsProduct) {
      await CartItems.updateOne({ Id_ProductVariants: Id_ProductVariants, Id_Cart: cart._id, Color: Color }, { $inc: { Quantity: 1 } });
      return res.status(201).json({ message: "Cart created successfully" });
    } else {
      const newCartItem = new CartItems({
        Id_Cart: cart._id,
        Id_ProductVariants: Id_ProductVariants,
        Size: Size,
        Price: Price,
        Color: Color,
        Quantity: quantity,
        Image: Image,
      });
      const resultItem = await newCartItem.save();
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
    // console.log(result);

    if (result) {
      // get cart items from linked document product
      const resultCartItems = await CartItems.find({ Id_Cart: result._id }).populate({
        path : "Id_ProductVariants",
        model : "ProductVariants",
        populate : {
          path : "Id_Products",
          model : "Product"
        }
      });
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
  const { Id_ProductVariants, Id_Cart, Color } = req.body;
console.log(Id_ProductVariants, Id_Cart, Color);

  try {
    const result = await CartItems.updateOne(
      {
        Id_Cart,
        Id_ProductVariants,
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
  const { Id_ProductVariants, Id_Cart, Color } = req.body;
  try {
    await CartItems.updateOne({ Id_Cart, Id_ProductVariants, Color }, { $inc: { Quantity: 1 } });

    return res.status(200).json({ message: "Tăng số lượng thành công" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handleDlCartItem = async (req, res) => {
  const { Id_ProductVariants, Id_Cart, Color } = req.body;
  try {
    await CartItems.deleteOne({ Id_Cart, Id_ProductVariants, Color });
    return res.status(200).json({ message: "Xóa thành công!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export { AddCart, GetCartByUser, handlePrevious, handleNext, handleDlCartItem };
