import express from "express"
import cloudinary from "../lib/cloudinary.js";
import protectedRoutes from "../lib/protectedRoutes.js";
import { Book } from "../models/book.js";

const router=express.Router();

router.post("/",protectedRoutes,async(req,res)=>{
    try {
    const {title,caption,ratings,image}=req.body;
    if(!title || !caption || !ratings || !image)
        return res.status(400).json({message:"please provide all the fields"})
    
    // uploading a file on cloudinary
    const uploadImage=await cloudinary.uploader.upload(image)
    const imageUrl=await uploadImage.secure_url;
    
    //saving new book
    const newBook=new Book({
        title,
        ratings,
        caption,
        image:imageUrl,
        user:req.user._id         //coming from protected routes
    })

    await newBook.save();
      return res.status(201).json({
            message: "Book created successfully",
            book: newBook
        });
    } catch (error) {
        console.log(error)
        res.status(500).json(`Issue in creating books ${error}`)
    }
})
//test 
// router.get("/test", protectedRoutes, (req, res) => {
//   return res.json({ message: "Middleware passed", user: req.user });
// });

router.get("/",protectedRoutes,async(req,res)=>{
    try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip=(page-1)*limit;
    const books=await Book.find().sort({createdAt:-1})
    .skip(skip)
    .limit(limit)
    .page(page)
    .populate("user","username profileImage") 
    
    const totalBooks=await Book.countDocuments();
    const totalPages=Math.ceil(totalBooks/limit);

    res.send({
        books,
        totalBooks,
        totalPages,
        currentPage:page                 //current pages from query
    })
    } catch (error) {
        console.log(error)
        res.status(500).json(`Issue in fetching books ${error}`)
    }
})

router.delete("/:id",protectedRoutes,async(req,res)=>{
    try {
        const book=await Book.findById(req.params.id)
    if(!book) return res.status(400).json({message:"Book Not Found"})
    
    if(book.user.toString()!=req.user._id.toString())
        return res.status(400).json({message:"Unauthorized"})
    
    // deleting image from cloudinary
    if(book.image&&book.image.includes("cloudinary.com")){
        try {
            const publicId=book.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId)
        } catch (error) {
            console.log(error)
        res.status(500).json(`Issue in deleting image of book ${error}`)
        }
     await book.deleteOne();
    }
    } catch (error) {
        console.log(error)
        res.status(500).json(`Issue in deleting books ${error}`)
    }
})

router.get("/user",protectedRoutes,async(req,res)=>{
    try {
        const books=await Book.find({user:req.user._id}).sort({createdAt:-1})
        if(!books) return res.status(400).json({message:"No recomended books"})
        res.json(books);                   //because it results a array of obj's
    } catch (error) {
         console.log(error)
        res.status(500).json(`Issue in fetching recomended books ${error}`)
    }
})
export default router;