const Lender = require("../models/lender.model")
const Tenant = require("../models/tenant.model")
const jwt = require("jsonwebtoken")

const authMiddleware = async function( req, res, next){
    const token = req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null
    const userType = req.header("x-UserType") ? req.header("x-UserType") : "Lender"
    try{
        const userId = jwt.verify(token, process.env.SECRET_KEY)
        const user =  userType === "Lender" ? await Lender.findOne({_id: userId}) : await Tenant.findOne({_id: userId})
        if(!user) return res.status(404).json("the user asigned to this token can no longer be found. Please verify if the account still exist")
        req.user = user
        req.token = token
        next()
    }catch(err){
        if(err) res.status(401).json("the user is not authorized. Please provide a valid token to proceed")
    }  
}

module.exports = {
    authMiddleware
}