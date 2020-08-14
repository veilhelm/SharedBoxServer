const EventEmiter = require("events")
const Lender = require("../models/lender.model")
const lendersubscribers = require("../subscribers/lender.subscribers")

class LenderService extends EventEmiter {

    createNewLender = async (req ,res) => {
        const lenderData = (({name, email, password, phoneNumber}) => ({name, email ,password, phoneNumber}))(req.body)
        try{
            const lender = await new Lender(lenderData)
            const token = await lender.generateAuthToken()
            await lender.save() 
            this.emit("lenderCreated")
            res.status(201).send(token)
        }catch(err){
            res.status(400).send(err)
        }
    }
}

const lenderService = new LenderService()

//set all listners so that every single function listed here will execute when the specify event within the object lender happens
lenderService.on(`lenderCreated`,lendersubscribers.sendRegistrationEmail)
module.exports = lenderService


