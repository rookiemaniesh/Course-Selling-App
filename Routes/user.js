const {Router}=require('express');
const UserRoutes= Router();
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {z}=require('zod');
const { userModel, purchaseModel, courseModel } = require('../db');
const { UserAuth } =require('../Middlewares/user.js')

const signupSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6),
    fullName:z.string().min(3)
})
const loginSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6)
})

UserRoutes.post('/signup',async(req,res)=>{
    try{
    const result=signupSchema.safeParse(req.body)
    if(!result.success){
        return res.status(404).json({
            message:"invalid input"
        })
    }
    
    const {email,password,fullName}=result.data;
   const hashedPassword=await bcrypt.hash(password,10);
    await userModel.create({
        fullName,
        email,
        password:hashedPassword,
        
    })
    res.json({
      message:"Account created"
    })
    }catch(e){
        return res.status(500).json({
            message:"internal server error",
            error:e
        })
    }
})
// const dotenv=require('dotenv')
// dotenv.config();
// require('dotenv').config();

// console.log(process.env.PORT)
UserRoutes.post('/login',async(req,res)=>{
     const JWT_SECRET=process.env.JWT_SECRET;

    const result=loginSchema.safeParse(req.body);
    if(!result.success){
        return res.status(404).json({
            message:"Invalid Format"
        })
    }
    const{email,password}=result.data;
    const user=await userModel.findOne({
        email:email
    })
    const passwordMatch= await bcrypt.compare(password,user.password)
    if(user && passwordMatch){
        const token=jwt.sign({
            id:user._id.toString()
        },JWT_SECRET)
        res.json({
            token:token
        })
    }
})
UserRoutes.get('/home',UserAuth,async(req,res)=>{
    const userId=req.userId;
    const response=await purchaseModel.find({
        userId
    });
    let purchasedCourses=[];
    for(let i=0;i<response.length;i++){
        purchasedCourses.push(response[i].courseId)
    }
    const courseData=await courseModel.find({
        _id:{$in:purchasedCourses}
    })
    res.json({
        purchasedCourses,
        courseData
    })
})

module.exports={
    UserRoutes
}