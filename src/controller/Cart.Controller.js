import { Cart } from "../models/Cart.model.js";
import { CartItems } from "../models/Cart_items.model.js";
import { Products } from "../models/Product.model.js";
const AddCart = async (req, res) => {
  const { idUser } = req.params;
  const { Id_ProductVariants, quantity, Size, Color, Image, Price } = req.body;

  try {
    // 1. Tìm hoặc tạo Cart
    let cart = await Cart.findOne({ Id_User: idUser });
    if (!cart) {
      const cartCreate = await new Cart({ Id_User: idUser }).save();
      if (cartCreate) {
        await new CartItems({
          Id_Cart: cartCreate._id,
          Id_ProductVariants,
          Size,
          Color,
          Price,
          Quantity: quantity,
          Image,
        }).save();
      }
    } else {
      // 2. Tìm sản phẩm trong CartItems
      const existingItem = await CartItems.findOne({
        Id_Cart: cart._id,
        Id_ProductVariants,
        Color,
      });

      if (existingItem) {
        // Nếu đã có sản phẩm → tăng số lượng
        await CartItems.updateOne({ _id: existingItem._id }, { $inc: { Quantity: 1 } });
      } else {
        // Nếu chưa có → thêm mới
        await new CartItems({
          Id_Cart: cart._id,
          Id_ProductVariants,
          Size,
          Color,
          Price,
          Quantity: quantity,
          Image,
        }).save();
      }
    }
    return res.status(201).json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
async function getCartWithItems(cartId) {
  const cart = await Cart.findById(cartId);
  const items = await CartItems.find({ Id_Cart: cartId }).populate({
    path: "Id_ProductVariants",
    model: "ProductVariants",
    populate: {
      path: "Id_Products",
      model: "Product",
    },
  });
  return { cart, items };
}

const GetCartByUser = async (req, res) => {
  const { idUser } = req.params;
  // console.log(idUser);

  try {
    // get cart by id user
    const result = await Cart.findOne({ Id_User: idUser });
    // console.log(result);


      // get cart items from linked document product
      const resultCartItems = await CartItems.find({ Id_Cart: result._id }).populate({
        path: "Id_ProductVariants",
        model: "ProductVariants",
        populate: {
          path: "Id_Products",
          model: "Product",
        },
      });
      // console.log(resultCartItems);

     
        return res.status(200).json({ resultCartItems });
      
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handlePrevious = async (req, res) => {
  const { Id_ProductVariants, Id_Cart, Color } = req.body;
  // console.log(Id_ProductVariants, Id_Cart, Color);

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

//  1 add cart
// const { idUser } = req.params;
//   const { Id_ProductVariants, quantity, Size, Color, Image, Price } = req.body;

//   try {
//     let cart = await Cart.findOne({ Id_User: idUser });
//     // Nếu chưa có cart → tạo mới
//     if (!cart) {
//       const newCart = new Cart({ Id_User: idUser });
//       cart = await newCart.save();

//       // Thêm sản phẩm đầu tiên vào cart
//       const cartItem = new CartItems({
//         Id_Cart: cart._id,
//         Id_ProductVariants,
//         Size,
//         Color,
//         Price,
//         Quantity: quantity,
//         Image,
//       });
//       await cartItem.save();

//       // Update cache Redis
//       const fullCart = await getCartWithItems(cart._id);
//       await redisClient.set(`cart:${idUser}`, JSON.stringify(fullCart), "EX", 3600);

//       return res.status(201).json({ message: "Cart created successfully" });
//     }

//     // Nếu đã có cart → check xem sản phẩm đã tồn tại chưa
//     const existingItem = await CartItems.findOne({
//       Id_Cart: cart._id,
//       Id_ProductVariants,
//       Color,
//     });

//     if (existingItem) {
//       // Tăng số lượng
//       await CartItems.updateOne({ _id: existingItem._id }, { $inc: { Quantity: 1 } });
//     } else {
//       // Thêm sản phẩm mới
//       const newCartItem = new CartItems({
//         Id_Cart: cart._id,
//         Id_ProductVariants,
//         Size,
//         Color,
//         Price,
//         Quantity: quantity,
//         Image,
//       });
//       await newCartItem.save();
//     }

//     // Sau khi cập nhật MongoDB, cập nhật lại Redis
//     const updatedCart = await getCartWithItems(cart._id);
//     await redisClient.set(`cart:${idUser}`, JSON.stringify(updatedCart), "EX", 3600);

//     return res.status(201).json({ message: "Cart updated successfully" });
//   } catch (error) {
//     console.error("Error add to cart:", error);
//     return res.status(500).json({ error: error.message });
//   }

// 2 prev

// const { Id_ProductVariants, Id_Cart, Color } = req.body;
//   try {
//     // 1. Cập nhật MongoDB
//     await CartItems.updateOne({ Id_Cart, Id_ProductVariants, Color }, { $inc: { Quantity: 1 } });

//     // 2. Lấy Id_User để xác định Redis key
//     const cart = await Cart.findById(Id_Cart);
//     if (!cart) return res.status(404).json({ message: "Cart not found" });
//     const idUser = cart.Id_User;

//     // 3. Lấy Redis cache
//     const redisData = await redisClient.get(`cart:${idUser}`);
//     if (redisData) {
//       const parsed = JSON.parse(redisData);
//       const items = parsed.items;

//       // 4. Tìm item tương ứng để tăng Quantity
//       const index = items.findIndex((item) => item.Id_ProductVariants._id === Id_ProductVariants && item.Color === Color);
//       if (index !== -1 && items[index].Quantity > 1) {
//         items[index].Quantity -= 1;
//         // 5. Ghi đè lại Redis cache
//         await redisClient.set(
//           `cart:${idUser}`,
//           JSON.stringify({
//             cartId: Id_Cart,
//             items,
//           }),
//           "EX",
//           3600
//         );
//       }
//     }

//     return res.status(200).json({ message: "Tăng số lượng thành công" });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ error: error.message });
//   }

// 3 next
// const { Id_ProductVariants, Id_Cart, Color } = req.body;
//   try {
//     // 1. Cập nhật MongoDB
//     await CartItems.updateOne({ Id_Cart, Id_ProductVariants, Color }, { $inc: { Quantity: 1 } });

//     // 2. Lấy Id_User để xác định Redis key
//     const cart = await Cart.findById(Id_Cart);
//     if (!cart) return res.status(404).json({ message: "Cart not found" });
//     const idUser = cart.Id_User;

//     // 3. Lấy Redis cache
//     const redisData = await redisClient.get(`cart:${idUser}`);
//     if (redisData) {
//       const parsed = JSON.parse(redisData);
//       const items = parsed.items;

//       // 4. Tìm item tương ứng để tăng Quantity
//       const index = items.findIndex((item) => item.Id_ProductVariants._id === Id_ProductVariants && item.Color === Color);
//       if (index !== -1 && items[index].Quantity >= 1) {
//         items[index].Quantity += 1;
//         // 5. Ghi đè lại Redis cache
//         await redisClient.set(
//           `cart:${idUser}`,
//           JSON.stringify({
//             cartId: Id_Cart,
//             items,
//           }),
//           "EX",
//           3600
//         );
//       }
//     }

//     return res.status(200).json({ message: "Tăng số lượng thành công" });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ error: error.message });
//   }

// 4 get cart
// const { idUser } = req.params;

// try {
//   // 1. Kiểm tra cache trong Redis trước
//   const cacheData = await redisClient.get(`cart:${idUser}`);
//   if (cacheData) {
//     const parsedCart = JSON.parse(cacheData);
//     return res.status(200).json({ resultCartItems: parsedCart.items });
//   }
//   // console.log('cacheData',cacheData);

//   // 2. Nếu không có cache → truy vấn MongoDB
//   const cart = await Cart.findOne({ Id_User: idUser });
//   if (!cart) {
//     return res.status(404).json({ message: "Cart not found" });
//   }

//   const resultCartItems = await CartItems.find({ Id_Cart: cart._id }).populate({
//     path: "Id_ProductVariants",
//     model: "ProductVariants",
//     populate: {
//       path: "Id_Products",
//       model: "Product",
//     },
//   });

//   // 3. Lưu vào cache Redis
//   const cachePayload = {
//     cartId: cart._id,
//     items: resultCartItems,
//   };

//   await redisClient.set(`cart:${idUser}`, JSON.stringify(cachePayload), "EX", 3600); // cache 1h

//   // 4. Trả về dữ liệu
//   return res.status(200).json({ resultCartItems });
// } catch (error) {
//   console.error("Error get cart:", error);
//   return res.status(500).json({ error: error.message });
// }
