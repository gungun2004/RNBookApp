import mongoose from "mongoose"

export const connectDB=async()=>{
  try {
    const conn=await mongoose.connect(process.env.MONGODB_URI)
    console.log(`DATABASE CONNECTED ${conn.connection.host}`)
  } catch (error) {
    console.log(`ERROR IN CONNECTING DATABASE ${error}`)
    process.exit(1);
  }

}