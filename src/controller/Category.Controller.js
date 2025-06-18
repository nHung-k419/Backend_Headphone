import { Categories } from "../models/Category.model.js";

const GetAllCategory = async (req, res) => {
  try {
    const getAllCategory = await Categories.find();
    if (getAllCategory) {
      return res.status(200).json({ getAllCategory });
    }
    return res.status(404).json({ message: "Not founded category" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const AddCategory = async (req, res) => {
  try {
    const { Name, Description } = req.body;
    if (Name && Description) {
      const NewCategory = new Categories({
        Name,
        Description,
      });
      const result = await NewCategory.save();
      if (!result) {
        return res.status(400).json({ message: "Category not created" });
      }
      return res.status(201).json({ message: "Category created successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const UpdateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Description } = req.body;
    const result = await Categories.updateOne(
      { _id: id },
      {
        $set: {
          Name,
          Description,
        },
      }
    );
    if (!result) {
      return res.status(400).json({ message: "Category not updated" });
    }
    return res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const DeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Categories.deleteOne({ _id: id });
    if (!result) {
      return res.status(400).json({ message: "Category not deleted" });
    }
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { GetAllCategory, AddCategory, UpdateCategory, DeleteCategory };