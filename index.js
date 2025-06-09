const express=require("express");
const {UserRoutes} = require('./Routes/user')
const dotenv=require('dotenv')
dotenv.config();
const mongoose=require('mongoose');
const { AdminRoutes } = require("./Routes/admin");
const { courseRoute } = require("./Routes/courses");
mongoose.connect(process.env.MongoDb_URL);
const app=express();
app.use(express.json());


app.use('/user',UserRoutes);
app.use('/admin',AdminRoutes);
app.use('/course',courseRoute)
const PORT=process.env.PORT
app.listen(PORT);