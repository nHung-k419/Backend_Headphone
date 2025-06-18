import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("Database connected");
        })
        connection.on("error", (err) => {
            console.log("Database connection failed");    
        })
    } catch (error) {
        console.log(error);
    }
    
}
export default connectDB