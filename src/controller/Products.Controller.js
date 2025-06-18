import { Products } from "../models/Product.model.js";
import { v2 as cloudinary } from "cloudinary";
const createProduct = async (req, res) => {
  try {
    const { Name, Price, Description, Brand,Id_Category } = req.body;
    const ImageUrl = req.file;
    Number(Price);
    if (Name && Price && Description && Brand && ImageUrl) {
      const newProduct = new Products({
        Name,
        Price,
        ImageUrl: ImageUrl,
        Description,
        Brand,
        Id_Category
      });
      await newProduct.save();
      return res.status(201).json({ message: "Product created successfully" });
    } else {
      return res.status(400).json({ message: "All fields are required" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getProduct = async (req, res) => {
  try {
    const getAllProduct = await Products.find();
    if (getAllProduct) {
      return res.status(200).json({ getAllProduct });
    }
    return res.status(404).json({ message: "Not founded product" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const resultId = await Products.findOne({ _id: id });
    const public_idCloud = resultId.ImageUrl.filename;
    const resultDelete = await Products.deleteOne({ _id: id });
    if (!resultDelete) {
      return res.status(400).json({ message: "Product not deleted" });
    }
    cloudinary.api.delete_resources(public_idCloud, (error, result) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      // console.log("result", result);
    });
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { Name, Price, Description, Brand,Id_Category } = req.body;
  const ImageUrl = req.file;
  // console.log(ImageUrl.path);

  try {
    const resultId = await Products.findOne({ _id: id });
    const public_idCloud = resultId.ImageUrl.filename;
    const resultUpdate = await Products.updateOne({ _id: id }, {
      $set: {
        Name,
        Price,
        ImageUrl: ImageUrl,
        Description,
        Brand,
        Id_Category,
      },
    });
    if (!resultUpdate) {
      return res.status(400).json({ message: "Product not updated" });
    }
    if (resultId) {
      cloudinary.api.delete_resources(public_idCloud, (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        console.log("result", result);
      });
    }
    return res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export { createProduct, getProduct, deleteProduct, updateProduct };
