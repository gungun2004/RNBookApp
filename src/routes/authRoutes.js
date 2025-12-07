import express from "express"
import { User } from "../models/user.js";
import jwt from "jsonwebtoken"
const router=express.Router();

const genToken=(userId)=>{
return jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"15d"})

}

router.post("/register",async(req,res)=>{
     try {
        //validations
     const {username,email,password}=req.body;
     if(!username || !email || !password)
        return res.status(400).json({message:"All fields are required"})        
    if(username.length<3)
        return res.status(400).json({message:"username must be atleast 3 characters long"})        
    if(password.length<6)
        return res.status(400).json({message:"password must be atleast 6 characters long"})  

    const existingUsername=await User.findOne({username});
    if(existingUsername)
        return res.status(400).json({message:"username already exists"}) 
        const existingEmail=await User.findOne({email});
    if(existingEmail)
        return res.status(400).json({message:"Email already exists"})  

    //random profileImage for all users
    const profileImage=`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
   //creating a new user
    const newUser= new User({username,email,password,profileImage})
    await newUser.save();
    
    //this will go to User model and save the hashed password and back to gentoken
    const token = genToken(newUser._id)
    res.status(201).json({token,user:{
        id:newUser._id,
        username:newUser.username,
        email:newUser.email,
        profileImage:newUser.profileImage
    }
    })

     } 
     catch (error) {
        console.log("Internal Server Error")
        res.send({message:`Issue in registering new user ${error}` })
     }
})

router.post("/login",async(req,res)=>{
    try {
        //validations
        const {username,password}=req.body;
        if(!username || !password )
        return res.status(400).json({message:"All fields are required"}); 
        const user=await User.findOne({username})
        if(!user) return  res.status(404).json({message:"Invalid credentials"});
        const passwordMatch=await user.comparePassword(password);
        if(!passwordMatch) return  res.status(404).json({message:"Invalid credentials"});
        
        const token = genToken(user._id)
        res.status(201).json({token,user:{
        id:user._id,
        username:user.username,
        email:user.email,
        profileImage:user.profileImage
    }
    })
    } catch (error) {
         console.log("Internal Server Error")
        res.send({message:`Issue in logging in ${error}` })
    }
})

export default router;