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
router.post("/CreateProduct", VerifyAuth, Decentralization(["admin"]), uploadCloud.single("ImageUrl"), createProduct);
router.get("/Products", getProductFavourite);
router.delete("/DeleteProduct/:id", VerifyAuth, Decentralization(["admin"]), deleteProduct);
router.put("/UpdateProduct/:id", VerifyAuth, Decentralization(["admin"]), uploadCloud.single("ImageUrl"), updateProduct);
router.get("/GetProductFilter", getProductFilter);
router.get("/SearchProducts", SearchProducts);
router.get("/productBestSeller", productBestSeller);
router.get("/newProduct", VerifyAuth, Decentralization(["user", "admin"]), newProduct);
router.get("/GetAllProduct", VerifyAuth, Decentralization(["admin"]), getProduct);
// router.get("/selectTypeProduct/:type", selectTypeProduct);

// Category Route
router.get("/GetAllCategory", GetAllCategory);
router.post("/CreateCategory", VerifyAuth, Decentralization(["admin"]), AddCategory);
router.delete("/DeleteCategory/:id", VerifyAuth, Decentralization(["admin"]), DeleteCategory);
router.put("/UpdateCategory/:id", VerifyAuth, Decentralization(["admin"]), UpdateCategory);

// Product Variants Route
router.post("/CreateProductVariants", VerifyAuth, Decentralization(["admin"]), uploadCloud.single("Image"), createProductVariants);
router.get("/GetProductVariantsByid/:id", getProductVariantsByid);
router.get("/GetAllProductVariants", VerifyAuth, Decentralization(["admin"]), GetAllProductVariants);
// router.get("/GetStockVariants", getStockVariant);
router.delete("/DeleteProductVariants/:id", VerifyAuth, Decentralization(["admin"]), deleteProductVariants);
router.put("/UpdateProductVariants/:id", VerifyAuth, Decentralization(["admin"]), uploadCloud.single("Image"), updateProductVariants);
// router.get("/GetAllProductVariants", VerifyAuth,Decentralization(["admin"]), GetAllProductVariants);
router.put("/updateStockProduct/:id", VerifyAuth, Decentralization(["admin"]), updateStockProduct);

// Brand Route Admin
router.get("/GetAllBrand", GetAllBrand);
router.post("/CreateBrand", VerifyAuth, Decentralization(["admin"]), AddBrand);
router.delete("/DeleteBrand/:id", VerifyAuth, Decentralization(["admin"]), DeleteBrand);
router.put("/UpdateBrand/:id", VerifyAuth, Decentralization(["admin"]), UpdateBrand);

// Auth Route
router.post("/Register", Register);
router.post("/Login", Login);
router.post("/RefreshToken", RefreshToken);
router.get("/createAccessToken", createAccessToken);
router.get("/createRefreshToken", createRefreshToken);
router.post("/Logout", Logout);
router.get("/getProfileUser/:id", getProfileUser);
router.put("/updateProfile/:id", VerifyAuth, Decentralization(["user", "admin"]), uploadCloud.single("Image"), updateProfile);

// detail product route
router.get("/GetDetailProduct/:id", GetDetailProduct);

// Cart Route
router.post("/AddCart/:idUser", VerifyAuth, Decentralization(["user", "admin"]), AddCart);
router.post("/GetCart/:idUser", VerifyAuth, Decentralization(["user", "admin"]), GetCartByUser);
router.post("/Previous", VerifyAuth, Decentralization(["user", "admin"]), handlePrevious);
router.post("/Next", VerifyAuth, Decentralization(["user", "admin"]), handleNext);
router.post("/DeleteCartItem", VerifyAuth, Decentralization(["user", "admin"]), handleDlCartItem);

// Order Route
router.get("/GetOrder/:idUser", VerifyAuth, Decentralization(["user", "admin"]), getOrder);
router.get("/GetAllOrder", VerifyAuth, Decentralization(["admin", "user"]), GetAllOrder);
router.post("/CreateOrder", VerifyAuth, Decentralization(["user", "admin"]), CreateOrder);
router.post("/GetOrderItems/:Id_User", VerifyAuth, Decentralization(["user", "admin"]), getOrderItems);
router.get("/GetAllOrderItems", VerifyAuth, Decentralization(["admin", "user"]), GetAllOrderItems);
router.put("/UpdateStatusOrder/:id", VerifyAuth, Decentralization(["admin", "user"]), updateStatusOrder);
router.post("/OrderPaymentZalo", VerifyAuth, Decentralization(["user", "admin"]), paymentWithZalopay);
router.post("/CallbackOrder", VerifyAuth, Decentralization(["user", "admin"]), Callback);
router.get("/GetAddressOrder/:Id_User", VerifyAuth, Decentralization(["user", "admin"]), getAddressOrder);

router.post("/sendImageComment", VerifyAuth, Decentralization(["user", "admin"]), uploadCloud.array("Images"), sendImageComment);
router.get("/getReviewsById/:idProduct", getReviewsById);

router.post("/CreateCommentLike", VerifyAuth, Decentralization(["user", "admin"]), CreateCommentLike);
router.get("/getLikeComment/:UserId", VerifyAuth, Decentralization(["user", "admin"]), getLikeComment);

// cancel order request
router.post("/requestCancle", VerifyAuth, Decentralization(["user", "admin"]), requestCancle);
router.get("/getAllCancleRequests", VerifyAuth, Decentralization(["admin"]), getAllCancleRequests);
router.put("/updateStatusCancleRequest/:id", VerifyAuth, Decentralization(["admin"]), updateStatusCancleRequest);
// chat Ai
router.post("/chat", handleChat);

// Voucher Route
router.post("/CreateVoucher", VerifyAuth, Decentralization(["admin"]), CreateVoucher);
router.post("/checkVoucher", VerifyAuth, Decentralization(["user", "admin"]), checkVoucher);
// Notification Route
router.get("/getNotificationById/:id", getNotificationById);
router.post("/markAsRead/:id", VerifyAuth, Decentralization(["user", "admin"]), markAsRead);

router.get("/getProvinces", getProvinces);
router.get("/getDistricts/:code", getDistricts);
router.get("/getWards/:code", getWards);
export default router;
