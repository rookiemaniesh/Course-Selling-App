const mongoose = require("mongoose");
const ObjectId=mongoose.Types.ObjectId
const {Schema}=mongoose;
const UserSchema=new Schema({
    fullName:String,
    email:String,
    password:String,
});
const adminSchema= new Schema({
    fullName:String,
    email:String,
    password:String,
});
const courseSchema=new Schema({
    title:String,
    description:String,
    price:Number,
    creatorId:ObjectId,
    imageUrl:String
});
const purchaseSchema=new Schema({
    userId:ObjectId,
    courseId:ObjectId
})
const userModel=mongoose.model("user",UserSchema);
const adminModel=mongoose.model("admin",adminSchema);
const courseModel=mongoose.model("course",courseSchema);
const purchaseModel=mongoose.model("purchase",purchaseSchema);
module.exports={
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}