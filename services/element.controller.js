const EventEmiter = require("events");
const Elements =require("../models/elements.model")
const elementSubscriber = require("../subscribers/element.subscribers")


class ElementServices extends EventEmiter{
    
    createNewElement = async (req,res)=>{
        const {elements,spaceId} = req.body
        try{
            const tenantId = req.user._id
            const elementsArr = await Elements.insertMany(elements)
            this.emit("elementsCreated", {tenantId,spaceId,elementsArr,res})
        }catch(err){
            res.status(400).json(err)
        }
    }

    getElementsTenant = async(req,res)=>{
        try{
            const tenantId = req.user._id
            const elements = await Elements.find({tenantId})
            res.status(200).json(elements)
        }
        catch(err){
            res.status(400).json(err)
        }
    }
}
const elementsServices = new ElementServices()
elementsServices.on('elementsCreated', elementSubscriber.addNewElementsToInventories)
elementsServices.on('elementsCreated', elementSubscriber.addNewElementsToTenant)

module.exports = elementsServices