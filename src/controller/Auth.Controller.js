import { Users } from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pkg from "cloudinary";
const { v2: cloudinary } = pkg;
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
const Register = async (req, res) => {
  const { Name, Email, Password } = req.body;
  //   console.log(Name, Email, Password);
  try {
    const isCheckUser = await Users.findOne({ Email });
    // console.log("isCheckUser", isCheckUser);
    if (isCheckUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashed = await bcrypt.hash(Password, 10);
    const result = new Users({ Name, Email, Password: hashed });
    const user = await result.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const Login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const isCheckUser = await Users.findOne({ Email });
    if (!isCheckUser) {
      return res.status(400).json({ message: "User not found" });
    }
    // console.log(isCheckUser);

    const match = await bcrypt.compare(Password, isCheckUser.Password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const accessToken = createAccessToken({ id: isCheckUser._id, Email: isCheckUser.Email });
    const refreshToken = createRefreshToken({ id: isCheckUser._id, Email: isCheckUser.Email });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      //   path: '/api/auth/refresh_token',
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: false, // Bắt buộc dùng ở production (HTTPS)
      maxAge: 15 * 60 * 1000, // 15 phút
    });
    res.cookie("User", JSON.stringify({ id: isCheckUser._id, Email: isCheckUser.Email, Name: isCheckUser.Name, Role: isCheckUser.Role }), {
      // httpOnly: true, // JS client không đọc được
      secure: true, // chỉ gửi qua HTTPS
      sameSite: "Strict",
      // maxAge: 60 * 60 * 1000, // 1h
    });
    return res.status(200).json({ message: "Login successfully", Email: isCheckUser.Email, Name: isCheckUser.Name, id: isCheckUser._id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const Logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: false, // true nếu dùng HTTPS
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: false,
    // path: "/api/auth/refresh", // nếu bạn set path khi tạo cookie
  });

  return res.status(200).json({ msg: "Logged out successfully" });
};

const RefreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    // console.log(token);

    if (!token) return res.status(401).json({ msg: "No refresh token" });
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ msg: "Invalid refresh token" });
      const accessToken = createAccessToken({ id: user.id, Email: user.Email });
      // console.log('accessToken',accessToken);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "Strict",
        secure: false, // Bắt buộc dùng ở production (HTTPS)
        maxAge: 15 * 60 * 1000, // 15 phút
      });

      res.json({ accessToken });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getProfileUser = async (req, res) => {
  try {
    const { id } = req.params;
    const isCheckUser = await Users.findOne({ _id: id });
    if (!isCheckUser) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json({ isCheckUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Email, Address, Phone, Sex, DateOfBirth } = req.body;
    // console.log(Name, Email, Address, Phone, Sex, DateOfBirth);

    const Image = req.file;
    // console.log(Image);
    let query = {};
    if (Name) query.Name = Name;
    if (Email) query.Email = Email;
    if (Address) query.Address = Address;
    if (Image) query.Image = Image;
    if (Phone) query.Phone = Phone;
    if (Sex) query.Sex = Sex;
    if (DateOfBirth) query.DateOfBirth = DateOfBirth;

    const isCheckUser = await Users.findOne({ _id: id });

    if (!isCheckUser) {
      return res.status(400).json({ message: "User not found" });
    }
    if (isCheckUser.Image) {
      cloudinary.api.delete_resources(isCheckUser.Image.filename, async (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
      });
    }
    await Users.updateOne({ _id: id }, { $set: query });

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export { Register, Login, createAccessToken, createRefreshToken, RefreshToken, Logout, getProfileUser, updateProfile };
