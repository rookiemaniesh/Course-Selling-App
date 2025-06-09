const jwt=require('jsonwebtoken');
function UserAuth(req,res,next){
    const JWT_SECRET=process.env.JWT_SECRET
    const token=req.headers.token
    try{
    const decode=jwt.verify(token,JWT_SECRET)
    
        req.userId=decode.id;
        next()
    
       
    }catch(e){
         return res.status(404).json({
            message:"sign up first"
        })
    }
}
module.exports = {
    UserAuth:UserAuth
}