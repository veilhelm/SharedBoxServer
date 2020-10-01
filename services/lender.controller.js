const EventEmiter = require("events")
const Lender = require("../models/lender.model")
const lendersubscribers = require("../subscribers/lender.subscribers")
const bcrypt = require("bcrypt")

class LenderService extends EventEmiter {

    createNewLender = async (req ,res) => {
        const lenderData = (({name, email, password, phoneNumber, profilePhoto}) => ({name, email ,password, phoneNumber, profilePhoto}))(req.body)
        try{
            const lender = await new Lender(lenderData)
            const token = await lender.generateAuthToken()
            await lender.encryptPassword()
            lender.tokens.push(token)
            this.emit("lenderCreated", lender)
            await lender.save()
            res.status(201).json({userToken:token, id: lender._id})
        }catch(err){
            res.status(400).json(err.message)
        }
    }

    savePhotos = async(req,res) => {
        const {userId} = req.body
        const files = req.body['file-0']
        try{
            const lender = await Lender.findById(userId)
            lender.profilePhoto = files.secure_url
            await lender.save({validateBeforeSave: false})
            res.status(200).json(lender)
        }
        catch(err){
            res.status(400).json(err.message)
        }
    }

    loginLender = async (req, res) => {
        const {email, password} = req.body
        try{
            const lender = await Lender.findOne({email}) || {}
            const isValid = await bcrypt.compare(password, lender.password || "" )
            if(Object.keys(lender).length === 0 || !isValid) throw Error("the email or password is incorrect")
            const token = await lender.generateAuthToken()
            await lender.updateOne({tokens: [...lender.tokens, token]})
            this.emit("lenderLoged")
            res.status(200).json({token,name: lender.name})
        }catch(err){
            res.status(401).json(err.message)
        }
    }

    getLender = async (req, res) => {
        res.status(200).json(req.user)
    }

    updateLender = async (req, res) => {
        if(req.body.password){
            req.user.password = req.body.password
            req.body.password = await req.user.encryptPassword()
        } 
        try{
            const updateSuccesful = await req.user.updateOne({...req.body})
            this.emit("lenderUpdated")
            res.status(200).json(req.user._id)
        }catch(err){
            res.status(400).json(err.message)
        }
    }

    deleteLender = async(req,res) => {        
        try {
            const lenderId = req.user._id;
            const lender = await Lender.findByIdAndDelete(lenderId)
            this.emit("deleteLender",lender)
            res.status(200).json("Lender sucessfully deleted") 
        } catch (err){
            res.status(400).json(err)
        }
    }
}

const lenderService = new LenderService()

//set all listners so that every single function listed here will execute when the specify event within the object lender happens
lenderService.on(`lenderCreated`, lendersubscribers.sendRegistrationEmail)
lenderService.on("deleteLender", lendersubscribers.deleteLenderReferences)
module.exports = lenderService


