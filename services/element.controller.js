const EventEmiter = require("events");
const Elements =require("../models/elements.model")
const Inventory = require('../models/inventory.model')
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

    updateElements = async (req, res) => {
        try{
            const element = await Elements.findOneAndUpdate({"_id": req.body.id},{$set:{...req.body.data}},{new:true})
            this.emit("elementUpdated", element)            
            res.status(200).json(element)
        }catch(err){
            res.status(400).json(err)
        }
    }

    getElementsByInventoryId = async (req, res) => {
        try{
            const {inventoryId} = req.query
            
            const inventory = await Inventory.findById(inventoryId)
                                .populate("elements")
            res.status(200).json(inventory.elements)
        }
        catch(err){
            res.status(400).json(err)
        }
    }
}
const elementsServices = new ElementServices()
elementsServices.on('elementsCreated', elementSubscriber.addNewElementsToInventories)
elementsServices.on('elementsCreated', elementSubscriber.addNewElementsToTenant)
elementsServices.on('elementUpdated', elementSubscriber.updateStatusOfNotification)

module.exports = elementsServices