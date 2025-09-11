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
  handleAddFavourite,
  getFavouriteByUser
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
  getAllAccount,
  updateRoleAccount
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
import { sendImageComment, getReviewsById, getAllReviews } from "../controller/Reviews.Controller.js";
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
router.post("/CreateProduct", uploadCloud.single("ImageUrl"), createProduct);
router.get("/Products", getProductFavourite);
router.delete("/DeleteProduct/:id", deleteProduct);
router.put("/UpdateProduct/:id", uploadCloud.single("ImageUrl"), updateProduct);
router.get("/GetProductFilter", getProductFilter);
router.get("/SearchProducts", SearchProducts);
router.get("/productBestSeller", productBestSeller);
router.get("/newProduct", newProduct);
router.get("/GetAllProduct", getProduct);
router.post("/handleAddFavourite", handleAddFavourite);
router.get("/getFavouriteByUser/:idUser", getFavouriteByUser);
// router.get("/selectTypeProduct/:type", selectTypeProduct);

// Category Route
router.get("/GetAllCategory", GetAllCategory);
router.post("/CreateCategory", AddCategory);
router.delete("/DeleteCategory/:id", DeleteCategory);
router.put("/UpdateCategory/:id", UpdateCategory);

// Product Variants Route
router.post("/CreateProductVariants", uploadCloud.single("Image"), createProductVariants);
router.get("/GetProductVariantsByid/:id", getProductVariantsByid);
router.get("/GetAllProductVariants", GetAllProductVariants);
// router.get("/GetStockVariants", getStockVariant);
router.delete("/DeleteProductVariants/:id", deleteProductVariants);
router.put("/UpdateProductVariants/:id", uploadCloud.single("Image"), updateProductVariants);
// router.get("/GetAllProductVariants", GetAllProductVariants);
router.put("/updateStockProduct/:id", updateStockProduct);

// Brand Route Admin
router.get("/GetAllBrand", GetAllBrand);
router.post("/CreateBrand", AddBrand);
router.delete("/DeleteBrand/:id", DeleteBrand);
router.put("/UpdateBrand/:id", UpdateBrand);

// Auth Route
router.post("/Register", Register);
router.post("/Login", Login);
router.post("/RefreshToken", RefreshToken);
router.get("/createAccessToken", createAccessToken);
router.get("/createRefreshToken", createRefreshToken);
router.post("/Logout", Logout);
router.get("/getProfileUser/:id", getProfileUser);
router.put("/updateProfile/:id", uploadCloud.single("Image"), updateProfile);
router.get("/getAllAccount", getAllAccount);
router.put("/updateRoleAccount/:id", updateRoleAccount);

// detail product route
router.get("/GetDetailProduct/:id", GetDetailProduct);

// Cart Route
router.post("/AddCart/:idUser", AddCart);
router.post("/GetCart/:idUser", GetCartByUser);
router.post("/Previous", handlePrevious);
router.post("/Next", handleNext);
router.post("/DeleteCartItem", handleDlCartItem);

// Order Route
router.get("/GetOrder/:idUser", getOrder);
router.get("/GetAllOrder", GetAllOrder);
router.post("/CreateOrder", CreateOrder);
router.post("/GetOrderItems/:Id_User", getOrderItems);
router.get("/GetAllOrderItems", GetAllOrderItems);
router.put("/UpdateStatusOrder/:id", updateStatusOrder);
router.post("/OrderPaymentZalo", paymentWithZalopay);
router.post("/CallbackOrder", Callback);
router.get("/GetAddressOrder/:Id_User", getAddressOrder);

// Reviews
router.post("/sendImageComment", uploadCloud.array("Images"), sendImageComment);
router.get("/getReviewsById/:idProduct", getReviewsById);
router.get("/getAllReviews", getAllReviews);
router.post("/CreateCommentLike", CreateCommentLike);
router.get("/getLikeComment/:UserId", getLikeComment);

// cancel order request
router.post("/requestCancle", requestCancle);
router.get("/getAllCancleRequests", getAllCancleRequests);
router.put("/updateStatusCancleRequest/:id", updateStatusCancleRequest);
// chat Ai
router.post("/chat", handleChat);

// Voucher Route
router.post("/CreateVoucher", CreateVoucher);
router.post("/checkVoucher", checkVoucher);
// Notification Route
router.get("/getNotificationById/:id", getNotificationById);
router.post("/markAsRead/:id", markAsRead);

router.get("/getProvinces", getProvinces);
router.get("/getDistricts/:code", getDistricts);
router.get("/getWards/:code", getWards);
export default router;
