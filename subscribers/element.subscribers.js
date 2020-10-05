const Inventory = require("../models/inventory.model")
const Tenant = require('../models/tenant.model')
const Notification = require("../models/notification.model")
const Event = require("../models/event.model")

module.exports = {
    addNewElementsToInventories: async ({tenantId,spaceId,elementsArr,res}) => {
        const inventory = await Inventory.create({spaceId, tenantId})
        elementsArr.forEach(element => {
            inventory.elements.push(element._id)
        });
        await inventory.save()
        res.status(200).json({inventoryId: inventory._id, tenantId})
    },

    addNewElementsToTenant: async ({tenantId,elementsArr})=>{
        const tenant = await Tenant.findById(tenantId)
        elementsArr.forEach(element => {
            tenant.elements.push(element._id)
        });
        await Tenant.findOneAndUpdate({_id: tenantId}, tenant)
    },

    updateStatusOfNotification: async (element) => {
        if(element.status === "element-rejected"){
            const [inventory] = await Inventory.find({'elements': element._id})
            const [notification] = await Notification.find({'inventoryId': inventory._id})
            const event = await new Event({
                type: "element-rejected",
                objectAffected: element._id,
                typeOfObjectAffected: "Elements",
                message:`${notification.lenderId} pointed out that there is an inconsistancy in your inventory. Please contact him`
            })
            await event.save()
            notification.status = "element-rejected"
            notification.events.push(event._id)
            notification.save({validateBeforeSave: false})
        }
        if(element.status === "element-updated"){            
            const [inventory] = await Inventory.find({'elements': element._id})
            const [notification] = await Notification.find({'inventoryId': inventory._id})
            const event = await new Event({
                type: "element-updated",
                objectAffected: element._id,
                typeOfObjectAffected: "Elements",
                message:`${notification.lenderId} pointed out that there is an inconsistancy in your inventory. Please contact him`
            })
            await event.save()
            notification.status = "element-updated"
            notification.events.push(event._id)
            notification.save({validateBeforeSave: false})
        } 
        if(element.status==="element-accepted"){
            const [inventory] = await Inventory.find({'elements': element._id})
            const [notification] = await Notification.find({'inventoryId': inventory._id})
            const event = await new Event({
                type: "element-accepted",
                objectAffected: element._id,
                typeOfObjectAffected: "Elements",
                message:`${notification.lenderId} pointed out that there is an inconsistancy in your inventory. Please contact him`
            })
            await event.save()
            notification.events.push(event._id)
            notification.save({validateBeforeSave: false})
        }
    }
}