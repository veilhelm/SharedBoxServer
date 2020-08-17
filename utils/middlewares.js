const Lender = require("../models/lender.model")
const jwt = require("jsonwebtoken")

const authMiddleware = async function( req, res, next){
    const token = req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null
    try{
        const lenderId = jwt.verify(token, process.env.SECRET_KEY)
        const lender = await Lender.findOne({_id: lenderId})
        req.lender = lender
        req.token = token
        next()
    }catch(err){
        if(err) res.status(401).send("the user is not authorized. Please provide a valid token to proceed")
    }  
}

module.exports = {
    authMiddleware
}