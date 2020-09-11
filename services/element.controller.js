const EventEmiter = require("events");
const Elements =require("../models/elements.model")
const elementSubscriber = require("../subscribers/element.subscribers")

class ElementServices extends EventEmiter{
    
    createNewElement = async (req,res)=>{
        const dataElement = (({ object, category, quantity, description, averageValue}) => ({object, category, quantity, description, averageValue}))(req.body);
        try{
            const elements = await new Elements(dataElement)
            elements.tenantId = req.user._id
            await elements.save()
            this.emit("elementCreated",elements)
            res.status(200).json(elements)
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
elementsServices.on('elementCreated',elementSubscriber.addNewElement)
module.exports = elementsServices