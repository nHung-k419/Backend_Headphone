import express, { Router } from "express";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  GetDetailProduct,
  getProductPageNavigation,
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
import { Register, Login, createAccessToken, createRefreshToken, RefreshToken, Logout } from "../controller/Auth.Controller.js";
import { AddCart, GetCartByUser, handlePrevious, handleNext, handleDlCartItem } from "../controller/Cart.Controller.js";
import { getOrder, CreateOrder, paymentWithZalopay, Callback, getOrderItems, getAddressOrder,GetAllOrder,GetAllOrderItems,updateStatusOrder } from "../controller/Order.Controller.js";
import { sendImageComment,getReviewsById } from "../controller/Reviews.Controller.js";
import { CreateCommentLike,getLikeComment } from "../controller/CommentLike.controller.js";
import { handleChat } from "../controller/Chatbot.Controller.js";
import VerifyAuth from "../middleWare/Verify.js";
import uploadCloud from "../config/CloudinaryConfig.js";
const router = express.Router();
// Product Route
router.post("/CreateProduct", VerifyAuth, uploadCloud.single("ImageUrl"), createProduct);
router.get("/Products", getProductPageNavigation);
router.delete("/DeleteProduct/:id", VerifyAuth, deleteProduct);
router.put("/UpdateProduct/:id", VerifyAuth, uploadCloud.single("ImageUrl"), updateProduct);
router.get("/GetProductFilter", getProductFilter);
router.get("/SearchProducts", SearchProducts);
router.get("/productBestSeller", productBestSeller);
router.get("/newProduct", newProduct);
router.get("/GetAllProduct", getProduct);
// router.get("/selectTypeProduct/:type", selectTypeProduct);

// Category Route
router.get("/GetAllCategory", GetAllCategory);
router.post("/CreateCategory", VerifyAuth, AddCategory);
router.delete("/DeleteCategory/:id", VerifyAuth, DeleteCategory);
router.put("/UpdateCategory/:id", VerifyAuth, UpdateCategory);

// Product Variants Route
router.post("/CreateProductVariants", VerifyAuth, uploadCloud.single("Image"), createProductVariants);
router.get("/GetProductVariantsByid/:id", getProductVariantsByid);
router.get("/GetAllProductVariants", VerifyAuth, GetAllProductVariants);
// router.get("/GetStockVariants", getStockVariant);
router.delete("/DeleteProductVariants/:id", VerifyAuth, deleteProductVariants);
router.put("/UpdateProductVariants/:id", VerifyAuth, uploadCloud.single("Image"), updateProductVariants);
router.get("/GetAllProductVariants", VerifyAuth, GetAllProductVariants);
router.put("/updateStockProduct/:id", updateStockProduct);

// Brand Route Admin
router.get("/GetAllBrand", GetAllBrand);
router.post("/CreateBrand", VerifyAuth, AddBrand);
router.delete("/DeleteBrand/:id", VerifyAuth, DeleteBrand);
router.put("/UpdateBrand/:id", VerifyAuth, UpdateBrand);

// Auth Route
router.post("/Register", Register);
router.post("/Login", Login);
router.post("/RefreshToken", RefreshToken);
router.get("/createAccessToken", createAccessToken);
router.get("/createRefreshToken", createRefreshToken);
router.post("/Logout", Logout);

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

router.post("/sendImageComment", uploadCloud.array("Images"), sendImageComment);
router.get("/getReviewsById/:idProduct", getReviewsById);

router.post("/CreateCommentLike", CreateCommentLike);
router.get("/getLikeComment/:UserId", getLikeComment);

// chat Ai
router.post("/chat", handleChat);
export default router;
