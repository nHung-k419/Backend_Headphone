import { get } from "mongoose";
import { Brands } from "../models/Brand.js";
const GetAllBrand = async (req, res) => {
  try {
    const getAllBrand = await Brands.find();
    if (getAllBrand) {
      return res.status(200).json({ data : getAllBrand });
    }
    return res.status(404).json({ message: "Not founded Brand" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const AddBrand = async (req, res) => {
  try {
    const { Brand, Description } = req.body;
    if (Brand && Description) {
      const NewBrand = new Brands({
        Brand,
        Description,
      });
      const result = await NewBrand.save();
      if (!result) {
        return res.status(400).json({ message: "Brand not created" });
      }
      return res.status(201).json({ message: "Brand created successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const UpdateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { Brand, Description } = req.body;
    const result = await Brands.updateOne(
      { _id: id },
      {
        $set: {
          Brand,
          Description,
        },
      }
    );
    if (!result) {
      return res.status(400).json({ message: "Brand not updated" });
    }
    return res.status(200).json({ message: "Brand updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const DeleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Brands.deleteOne({ _id: id });
    if (!result) {
      return res.status(400).json({ message: "Brand not deleted" });
    }
    return res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { GetAllBrand, AddBrand, UpdateBrand, DeleteBrand };