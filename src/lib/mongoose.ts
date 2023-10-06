import mongoose from "mongoose";
let isConnected: boolean = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGODB_URL) {
    return console.log("MONGODB_URL not found");
  }
  if (isConnected) {
    return console.log("Already connected to DB");
  }
  try {
    await mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => {
        isConnected = true;
        console.log("Connected to MongoDB Atlas");
      })
      .catch((err) => {
        console.log("Error connecting to MongoDB Atlas");
        console.log(err);
      });
  } catch (error) {
    console.log("Error connecting to MongoDB Atlas");
  }
};
