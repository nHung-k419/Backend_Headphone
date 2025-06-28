import mongoose from "mongoose";

const UserSchemma = new mongoose.Schema({
    Name : {type: String},
    Email : {type: String, required: true, unique: true},
    Password : {type: String, required: true},
    Image : {type: String},
    Role : {type: String},
    CreateAt: { type: Date, default: Date.now() }, 
})

const Users = mongoose.model("User", UserSchemma);

export { Users };