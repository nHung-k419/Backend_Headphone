import { ProductVariants } from "../models/Product_Variants.js";
import { v2 as cloudinary } from "cloudinary";
const createProductVariants = async (req, res) => {
  try {
    const { Color, Size, Stock, Id_Products } = req.body;
    const Image = req.file;
    if (Color && Size && Stock && Image && Id_Products) {
      const newProductVariants = new ProductVariants({
        Color,
        Size,
        Image: Image,
        Stock,
        Id_Products,
      });
      await newProductVariants.save();
      return res.status(201).json({ message: "Product Variants created successfully" });
    } else {
      return res.status(400).json({ message: "All fields are required" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getProductVariants = async (req, res) => {
  try {
    const getAllProductVariants = await ProductVariants.find();
    if (getAllProductVariants) {
      return res.status(200).json({ getAllProductVariants });
    }
    return res.status(404).json({ message: "Not founded product Variants" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const deleteProductVariants = async (req, res) => {
  const { id } = req.params;
  try {
    const resultId = await ProductVariants.findOne({ _id: id });
    const public_idCloud = resultId.Image.filename;
    const resultDelete = await ProductVariants.deleteOne({ _id: id });
    if (!resultDelete) {
      return res.status(400).json({ message: "Product Variants not deleted" });
    }
    cloudinary.api.delete_resources(public_idCloud, (error, result) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      // console.log("result", result);
    });
    return res.status(200).json({ message: "Product Variants deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const updateProductVariants = async (req, res) => {
  const { id } = req.params;
  const { Color, Size, Stock, Id_Products } = req.body;
  const Image = req.file;
  try {
    const resultId = await ProductVariants.findOne({ _id: id });
    const public_idCloud = resultId.Image.filename;
    const resultUpdate = await ProductVariants.updateOne(
      { _id: id },
      {
        $set: {
          Color,
          Size,
          Image: Image,
          Stock,
          Id_Products,
        },
      }
    );
    if (!resultUpdate) {
      return res.status(400).json({ message: "Product Variants not updated" });
    }
    if (resultId) {
      cloudinary.api.delete_resources(public_idCloud, (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        console.log("result", result);
      });
    }
    return res.status(200).json({ message: "Product Variants updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export { createProductVariants, getProductVariants, deleteProductVariants, updateProductVariants };
