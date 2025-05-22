const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyToken = (req,res,next)=>{
  const token = req.cookies.token
  if(!token){
    return res.status(401).json({message: "Unathorized"})
  }else{
    try {
      const decode  = jwt.verify(token,process.env.JWT_KEY)
      req.user = decode 
    } catch (error) {
      res.status(401).json({message: error})
    }
  }
}