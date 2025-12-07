import mongoose, { Types } from "mongoose"
import { User } from "./user.js"

const bookSchema= new mongoose.Schema({
    title:{
    type:String,
    required:true,
    },
    caption:{
      type:String,
      required:true,
    },
    ratings:{
        type:Number,
        min:1,
        max:5,
        required:true,
    },
    user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:User
    }

    

},{timestamps:true})

export const Book=mongoose.model("Book",bookSchema)