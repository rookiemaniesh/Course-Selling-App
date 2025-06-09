const {Router} = require('express');
const { UserAuth } = require('../Middlewares/user');
const { courseModel, purchaseModel } = require('../db');
const courseRoute=Router();

courseRoute.post('/purchase',UserAuth, async(req,res)=>{
   try{
    const {courseId}=req.body;
   const userId=req.userId;
    const response=await courseModel.findOne({
        _id:courseId
    })
    if(response){
        await purchaseModel.create({
            userId,
            courseId
        })
        res.json({
            message:"course added to your account"
        })
    }else{
        res.json({
            message:"Enter Valid Course Code"
        })
    }

}catch(e){
    res.status(500).json({
            message:"Interval Server Error",
            error:e,
        })
}
})
courseRoute.get('/preview',async (req,res)=>{
    const course=await courseModel.find({})
    res.json({
        course
    })
})
module.exports={
    courseRoute
}