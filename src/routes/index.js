import express, { Router } from "express";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  GetDetailProduct,
  getProductFavourite,
  getProductFilter,
  SearchProducts,
  productBestSeller,
  newProduct,
  getProduct,
  // selectTypeProduct
} from "../controller/Products.Controller.js";
import { GetAllCategory, AddCategory, UpdateCategory, DeleteCategory } from "../controller/Category.Controller.js";
import {
  createProductVariants,
  getProductVariantsByid,
  deleteProductVariants,
  updateProductVariants,
  GetAllProductVariants,
  updateStockProduct,
} from "../controller/Product_Variants.js";
import { GetAllBrand, AddBrand, UpdateBrand, DeleteBrand } from "../controller/Brand.Comtroller.js";
import {
  Register,
  Login,
  createAccessToken,
  createRefreshToken,
  RefreshToken,
  Logout,
  getProfileUser,
  updateProfile,
} from "../controller/Auth.Controller.js";
import { AddCart, GetCartByUser, handlePrevious, handleNext, handleDlCartItem } from "../controller/Cart.Controller.js";
import {
  getOrder,
  CreateOrder,
  paymentWithZalopay,
  Callback,
  getOrderItems,
  getAddressOrder,
  GetAllOrder,
  GetAllOrderItems,
  updateStatusOrder,
  
} from "../controller/Order.Controller.js";
import { sendImageComment, getReviewsById } from "../controller/Reviews.Controller.js";
import { CreateCommentLike, getLikeComment } from "../controller/CommentLike.controller.js";
import { handleChat } from "../controller/Chatbot.Controller.js";
import { requestCancle, getAllCancleRequests, updateStatusCancleRequest } from "../controller/cancel_requests .Controller.js";
import { CreateVoucher, checkVoucher } from "../controller/Voucher.Controller.js";
import { getNotificationById, markAsRead } from "../controller/Notifacation.Controller.js";
import VerifyAuth from "../middleWare/Verify.js";
import uploadCloud from "../config/CloudinaryConfig.js";
import Decentralization from "../middleWare/Decentralization.js";
import { getDistricts, getProvinces, getWards } from "../controller/Location.Controller.js";
const router = express.Router();
// Product Route
router.post("/CreateProduct", Decentralization(["admin"]), uploadCloud.single("ImageUrl"), createProduct);
router.get("/Products", getProductFavourite);
router.delete("/DeleteProduct/:id", Decentralization(["admin"]), deleteProduct);
router.put("/UpdateProduct/:id", Decentralization(["admin"]), uploadCloud.single("ImageUrl"), updateProduct);
router.get("/GetProductFilter", getProductFilter);
router.get("/SearchProducts", SearchProducts);
router.get("/productBestSeller", productBestSeller);
router.get("/newProduct", Decentralization(["user", "admin"]), newProduct);
router.get("/GetAllProduct", Decentralization(["admin"]), getProduct);
// router.get("/selectTypeProduct/:type", selectTypeProduct);

// Category Route
router.get("/GetAllCategory", GetAllCategory);
router.post("/CreateCategory", Decentralization(["admin"]), AddCategory);
router.delete("/DeleteCategory/:id", Decentralization(["admin"]), DeleteCategory);
router.put("/UpdateCategory/:id", Decentralization(["admin"]), UpdateCategory);

// Product Variants Route
router.post("/CreateProductVariants", Decentralization(["admin"]), uploadCloud.single("Image"), createProductVariants);
router.get("/GetProductVariantsByid/:id", getProductVariantsByid);
router.get("/GetAllProductVariants", Decentralization(["admin"]), GetAllProductVariants);
// router.get("/GetStockVariants", getStockVariant);
router.delete("/DeleteProductVariants/:id", Decentralization(["admin"]), deleteProductVariants);
router.put("/UpdateProductVariants/:id", Decentralization(["admin"]), uploadCloud.single("Image"), updateProductVariants);
// router.get("/GetAllProductVariants",Decentralization(["admin"]), GetAllProductVariants);
router.put("/updateStockProduct/:id", Decentralization(["admin"]), updateStockProduct);

// Brand Route Admin
router.get("/GetAllBrand", GetAllBrand);
router.post("/CreateBrand", Decentralization(["admin"]), AddBrand);
router.delete("/DeleteBrand/:id", Decentralization(["admin"]), DeleteBrand);
router.put("/UpdateBrand/:id", Decentralization(["admin"]), UpdateBrand);

// Auth Route
router.post("/Register", Register);
router.post("/Login", Login);
router.post("/RefreshToken", RefreshToken);
router.get("/createAccessToken", createAccessToken);
router.get("/createRefreshToken", createRefreshToken);
router.post("/Logout", Logout);
router.get("/getProfileUser/:id", getProfileUser);
router.put("/updateProfile/:id", Decentralization(["user", "admin"]), uploadCloud.single("Image"), updateProfile);

// detail product route
router.get("/GetDetailProduct/:id", GetDetailProduct);

// Cart Route
router.post("/AddCart/:idUser", Decentralization(["user", "admin"]), AddCart);
router.post("/GetCart/:idUser", Decentralization(["user", "admin"]), GetCartByUser);
router.post("/Previous", Decentralization(["user", "admin"]), handlePrevious);
router.post("/Next", Decentralization(["user", "admin"]), handleNext);
router.post("/DeleteCartItem", Decentralization(["user", "admin"]), handleDlCartItem);

// Order Route
router.get("/GetOrder/:idUser", Decentralization(["user", "admin"]), getOrder);
router.get("/GetAllOrder", Decentralization(["admin", "user"]), GetAllOrder);
router.post("/CreateOrder", Decentralization(["user", "admin"]), CreateOrder);
router.post("/GetOrderItems/:Id_User", Decentralization(["user", "admin"]), getOrderItems);
router.get("/GetAllOrderItems", Decentralization(["admin", "user"]), GetAllOrderItems);
router.put("/UpdateStatusOrder/:id", Decentralization(["admin", "user"]), updateStatusOrder);
router.post("/OrderPaymentZalo", Decentralization(["user", "admin"]), paymentWithZalopay);
router.post("/CallbackOrder", Decentralization(["user", "admin"]), Callback);
router.get("/GetAddressOrder/:Id_User", Decentralization(["user", "admin"]), getAddressOrder);

router.post("/sendImageComment", Decentralization(["user", "admin"]), uploadCloud.array("Images"), sendImageComment);
router.get("/getReviewsById/:idProduct", getReviewsById);

router.post("/CreateCommentLike", Decentralization(["user", "admin"]), CreateCommentLike);
router.get("/getLikeComment/:UserId", Decentralization(["user", "admin"]), getLikeComment);

// cancel order request
router.post("/requestCancle", Decentralization(["user", "admin"]), requestCancle);
router.get("/getAllCancleRequests", Decentralization(["admin"]), getAllCancleRequests);
router.put("/updateStatusCancleRequest/:id", Decentralization(["admin"]), updateStatusCancleRequest);
// chat Ai
router.post("/chat", handleChat);

// Voucher Route
router.post("/CreateVoucher", Decentralization(["admin"]), CreateVoucher);
router.post("/checkVoucher", Decentralization(["user", "admin"]), checkVoucher);
// Notification Route
router.get("/getNotificationById/:id", getNotificationById);
router.post("/markAsRead/:id", Decentralization(["user", "admin"]), markAsRead);

router.get("/getProvinces", getProvinces);
router.get("/getDistricts/:code", getDistricts);
router.get("/getWards/:code", getWards);
export default router;
