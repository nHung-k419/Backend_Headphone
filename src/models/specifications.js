import mongoose from "mongoose";

const SpecificationSchema = new mongoose.Schema({
    //Pin & Sạc
    batteryLife: { type: Number }, // giờ
    chargingTime: { type: Number }, // giờ
    fastCharging: { type: Boolean, default: false },

    //Kết nối
    bluetoothVersion: { type: String },
    connectionRange: { type: Number }, // mét
    chargingPort: { type: String }, // USB-C, Lightning

    //Âm thanh
    driverSize: { type: Number }, // mm

    // Tính năng
    anc: { type: Boolean, default: false },
    waterResistance: { type: String }, // IPX4, IPX7
    microphone: { type: Boolean, default: true },

}, { _id: false });

export default SpecificationSchema;