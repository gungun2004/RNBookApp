import mongoose from "mongoose";
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({
username:{
    type:String,
    required:true,
    unique:true,
    minlength:3 
    },
    email:{
    type:String,
    required:true,
    unique:true 
    },
    password:{
    type:String,
    required:true,
    },
    profileImage:{
    type:String,
    default:""
    }
},{timestamps:true});



userSchema.pre("save",async function(next){
if(!this.isModified("password")) return next();         //if password is not changed in case user changes the username or email 

    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();

})

//methid to comparePassword
userSchema.methods.comparePassword=async function(password){
return bcrypt.compare(password,this.password)
}

export const User = mongoose.model('User', userSchema);