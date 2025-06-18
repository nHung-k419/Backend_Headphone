import express from "express";
import { createProduct, getProduct, deleteProduct, updateProduct } from "../controller/Products.Controller.js";
import { GetAllCategory, AddCategory, UpdateCategory, DeleteCategory } from "../controller/Category.Controller.js";
import { createProductVariants, getProductVariants, deleteProductVariants, updateProductVariants } from "../controller/Product_Variants.js";
import uploadCloud from "../config/CloudinaryConfig.js";
const router = express.Router();
// Product Route
router.post("/CreateProduct", uploadCloud.single("ImageUrl"), createProduct);
router.get("/GetAllProduct", getProduct);
router.delete("/DeleteProduct/:id", deleteProduct);
router.put("/UpdateProduct/:id", uploadCloud.single("ImageUrl"), updateProduct);

// Category Route
router.get("/GetAllCategory", GetAllCategory);
router.post("/CreateCategory", AddCategory);
router.delete("/DeleteCategory/:id", DeleteCategory);
router.put("/UpdateCategory/:id", UpdateCategory);

// Product Variants Route
router.post("/CreateProductVariants",uploadCloud.single("Image"), createProductVariants);
router.get("/GetAllProductVariants", getProductVariants);
router.delete("/DeleteProductVariants/:id", deleteProductVariants);
router.put("/UpdateProductVariants/:id",uploadCloud.single("Image"), updateProductVariants);
export default router;
