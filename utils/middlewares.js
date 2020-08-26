const Lender = require("../models/lender.model")
const jwt = require("jsonwebtoken")

const authMiddleware = async function( req, res, next){
    const token = req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null
    try{
        const lenderId = jwt.verify(token, process.env.SECRET_KEY)
        const lender = await Lender.findOne({_id: lenderId})
        if(!lender) return res.status(404).json("the user asigned to this token can no longer be found. Please verify if the account still exist")
        req.lender = lender
        req.token = token
        next()
    }catch(err){
        if(err) res.status(401).json("the user is not authorized. Please provide a valid token to proceed")
    }  
}

module.exports = {
    authMiddleware
}