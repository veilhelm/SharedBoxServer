const Inventory = require("../models/inventory.model")
const Tenant = require('../models/tenant.model')

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
        await Tenant.findOneAndUpdate({_id: tenantId},tenant)
    }
}