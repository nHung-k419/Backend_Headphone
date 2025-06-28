import { Products } from "../models/Product.model.js";
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;

const createProduct = async (req, res) => {
  try {
    const { Name, Price, Description, Brand, Id_Category } = req.body;
    const ImageUrl = req.file;
    console.log(Brand);

    Number(Price);
    if (Name && Price && Description && Brand && ImageUrl) {
      const newProduct = new Products({
        Name,
        Price,
        ImageUrl: ImageUrl,
        Description,
        Brand,
        Id_Category,
      });
      const result = await newProduct.save();
      if (result) {
        return res.status(201).json({ message: "Product created successfully" });
      }
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
const getProductPageNavigation = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const getAllProductPage = await Products.find().skip(skip).limit(limit);
    if (getAllProductPage) {
      return res
        .status(200)
        .json({ data: getAllProductPage, currentPage: page, totalPages: Math.ceil((await Products.countDocuments()) / limit) });
    }
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
  const { Name, Price, Description, Brand, Id_Category } = req.body;
  const ImageUrl = req.file;
  // console.log(ImageUrl.path);

  try {
    const resultId = await Products.findOne({ _id: id });
    const public_idCloud = resultId.ImageUrl.filename;
    const resultUpdate = await Products.updateOne(
      { _id: id },
      {
        $set: {
          Name,
          Price,
          ImageUrl: ImageUrl,
          Description,
          Brand,
          Id_Category,
        },
      }
    );
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

const GetDetailProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Products.findOne({ _id: id });
    if (result) {
      return res.status(200).json({ result });
    }
    return res.status(404).json({ message: "Not founded product" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getProductFilter = async (req, res) => {
  try {
    const idCategory = req.query.idCategory;
    const idBrand = req.query.idBrand;
    const valuePrice = parseFloat(req.query.valuePrice);
    const keyWord = req.query.keyWord;
    console.log(keyWord);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const filter = {};
    if (idBrand) filter.Brand = idBrand;
    if (idCategory) filter.Id_Category = idCategory;
    if (!isNaN(valuePrice)) {
      filter.Price = { $gte: valuePrice };
    }
    if (keyWord) {
      filter.Name = { $regex: keyWord, $options: "i" };
    }
    // console.log(filter);
    const products = await Products.find(filter).skip(skip).limit(limit);
    const total = await Products.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    return res.json({ products, total, totalPages, currentPage: page });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const SearchProducts = async (req, res) => {
  try {
    const { keyWord } = req.query;
    const resultSearch = await Products.find({ Name: { $regex: keyWord, $options: "i" } });
    if (resultSearch) {
      return res.status(200).json({ resultSearch });
    }
    return res.status(404).json({ message: "Not founded product" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export {
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  GetDetailProduct,
  getProductPageNavigation,
  getProductFilter,
  SearchProducts,
};
