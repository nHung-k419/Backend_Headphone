import { Products } from "../models/Product.model.js";
import { ProductVariants } from "../models/Product_Variants.js";
import { Reviews } from "../models/Reviews.model.js";
import pkg from "cloudinary";
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

const getProductFavourite = async (req, res) => {
  try {
    const products = await Products.find({Rating : { $gt: 4 }}).lean();
    const getAllProductPage = await Promise.all(
      products.map(async (product) => {
        const variants = await ProductVariants.find({ Id_Products: product._id });
        const prices = variants.map((v) => v.Price);
        const minPrice = prices.length ? Math.min(...prices) : null;
        const maxPrice = prices.length ? Math.max(...prices) : null;

        return {
          ...product,
          minPrice,
          maxPrice,
        };
      })
    );
   
    return res.status(200).json({ data: getAllProductPage });
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
    // const {idVariant} = req.query
    // console.log(idVariant);

    const result = await Products.findOne({ _id: id });
    // const result = await ProductVariants.findOne({ Id_Products: id }).populate("Id_Products");
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
    const type = req.query.type;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    let filter = {};
    let sort = {};

    if (type === "Mới nhất") sort = { createdAt: -1 };
    if (type === "Phổ biến") filter.Sold = { $gt: 0 };
    if (type === "Tất cả") filter = {};

    if (idBrand) filter.Brand = idBrand;
    if (idCategory) filter.Id_Category = idCategory;
    if (!isNaN(valuePrice)) {
      filter.Price = { $gte: valuePrice };
    }
    if (keyWord) {
      filter.Name = { $regex: keyWord, $options: "i" };
    }

    const products = await Products.find(filter).sort(sort).skip(skip).limit(limit).lean(); // use lean to map more spead
    const total = await Products.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // get min and max price for each product
    const productsWithPrice = await Promise.all(
      products.map(async (product) => {
        const variants = await ProductVariants.find({ Id_Products: product._id });
        const prices = variants.map((v) => v.Price);
        const minPrice = prices.length ? Math.min(...prices) : null;
        const maxPrice = prices.length ? Math.max(...prices) : null;

        return {
          ...product,
          minPrice,
          maxPrice,
        };
      })
    );

    return res.json({ products: productsWithPrice, total, totalPages, currentPage: page });
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

const productBestSeller = async (req, res) => {
  try {
    const result = await ProductVariants.find({ Sold: { $gt: 0 } })
      .populate({
        path: "Id_Products",
        model: "Product",
      })
      .sort({ Sold: -1 })
      .limit(20);
    const AllProductSellerReviews = await Promise.all(
      result.map(async (item) => {
        const reviews = await Reviews.find({ Id_Product: item.Id_Products._id });
        return {
          item,
          reviews,
        };
      })
    );
    return res.status(200).json({ AllProductSellerReviews });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const newProduct = async (req, res) => {
  try {
    const result = await Products.find().sort({ createdAt: -1 }).limit(4);
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// const selectTypeProduct = async (req, res) => {
//   try {
//     const { type } = req.params;
//     let result;
//     if (type === "Mới nhất") {
//       result = await Products.find().sort({ createdAt: -1 });
//     } else if (type === "Phổ biến") {
//       result = await Products.find({Sold : {$gt: 0}})
//     }
//     return res.status(200).json({ result });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

export {
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  GetDetailProduct,
  getProductFavourite,
  getProductFilter,
  SearchProducts,
  productBestSeller,
  newProduct,
  // selectTypeProduct,
};
