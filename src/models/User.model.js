import mongoose from "mongoose";

const UserSchemma = new mongoose.Schema({
  Name: { type: String },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Phone: { type: String, default: null },
  DateOfBirth: { type: String, default: null },
  Address: { type: String, default: null },
  Sex: { type: String, default: null },
  Image: { type: Object, default: null },
  Role: { type: String, default: "user" },
  VoucherSent : {type : Array, default : []},
  CreateAt: { type: Date, default: Date.now() },
});

const Users = mongoose.model("User", UserSchemma);

export { Users };
