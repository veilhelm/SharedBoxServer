const EventEmiter = require("events")
const Lender = require("../models/lender.model")
const lendersubscribers = require("../subscribers/lender.subscribers")
const bcrypt = require("bcrypt")

class LenderService extends EventEmiter {

    createNewLender = async (req ,res) => {
        const lenderData = (({name, email, password, phoneNumber}) => ({name, email ,password, phoneNumber}))(req.body)
        try{
            const lender = await new Lender(lenderData)
            const token = await lender.generateAuthToken()
            this.emit("lenderCreated")
            res.status(201).json(token)
        }catch(err){
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
            this.emit("userLoged")
            res.status(200).json(token)
        }catch(err){
            console.log(err)
            res.status(401).json(err.message)
        }
    }

    getLender = async (req, res) => {
        res.status(200).json(req.lender)
    }
}

const lenderService = new LenderService()

//set all listners so that every single function listed here will execute when the specify event within the object lender happens
lenderService.on(`lenderCreated`,lendersubscribers.sendRegistrationEmail)
lenderService.on("userLoged", () => console.log("a user has loged in the app"))
module.exports = lenderService


