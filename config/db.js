import mongoose from "mongoose";
const connectDB = async() => {
    try {
        const conn  = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error in MongoDB Connect : ${error}`);
    }
};

export default connectDB;