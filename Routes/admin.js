const {Router}=require('express');
const AdminRoutes= Router();
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {z}=require('zod');
const { adminModel, courseModel } = require('../db');
const { adminAuth } = require('../Middlewares/admin');
const signupSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6),
    fullName:z.string().min(3)
})
const loginSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6)
    
})
AdminRoutes.post('/signup',async(req,res)=>{
    try{
    const result=signupSchema.safeParse(req.body)
    if(!result.success){
        return res.status(404).json({
            message:"invalid input"
        })
    }
    console.log(result.data.fullName)
    const {email,password,fullName}=result.data;
    const hashedPassword= await bcrypt.hash(password,10)
   await adminModel.create({
        fullName,
        email,
        password:hashedPassword,
        
    })
    res.json({
       message:"Account Created"
    })
    }catch{
        return res.status(500).json({
            message:"internal server error"
        })
    }
})
AdminRoutes.post('/login',async(req,res)=>{
     const JWT_SECRET_ADMIN=process.env.JWT_SECRET_ADMIN;
   
    const result=loginSchema.safeParse(req.body);
    if(!result.success){
        return res.status(404).json({
            message:"Invalid Format"
        })
    }
    try{
    const{email,password}=result.data;
    const user=await adminModel.findOne({
        email:email
    })
    console.log(user)
    const passwordMatch= await bcrypt.compare(password,user.password)
    console.log(passwordMatch)
    if(user && passwordMatch){
        const token=jwt.sign({
            id:user._id.toString()
        },JWT_SECRET_ADMIN)
        
        res.json({
            token:token
        })
    }else{
        res.json({
            message:"invalid credentials"
        })
    }
    }catch(e){
        res.status(500).json({
            message:"Interval Server Error",
            error:e,
        })
    }
})
AdminRoutes.get('/home',adminAuth,async(req,res)=>{
   const userId=req.userId;
   const result=await courseModel.find({
    creatorId:userId
   })
   
   res.json({
   result
   })
})
AdminRoutes.post('/course',adminAuth,async(req,res)=>{
    const {title,description,price,imageUrl}=req.body
    const adminId=req.userId;
    
    const course=await courseModel.create({
        title,
        description,
        price,
        imageUrl,
       creatorId: adminId
    })
    res.json({
        message:"course created",
        courseId: course._id
    })
})
AdminRoutes.put('/course',adminAuth,async(req,res)=>{
    const {title,description,price,imageUrl,courseId}=req.body
    const adminId=req.userId;
    const course=await courseModel.updateOne({
        creatorId: adminId,
        _id: courseId
    },{
        title,
        description,
        price,
        imageUrl,
       
    })
    res.json({
        message:"course updated",
        courseId: course._id
    })
})


module.exports={
    AdminRoutes
}