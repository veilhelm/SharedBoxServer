const Lender = require('../models/lender.model')
const Tenant = require('../models/tenant.model')
module.exports = {
    addNotificationIdToLender: async ({notification, res}) => {      
        const { _id, lenderId} = notification
        const lender = await Lender.findById(lenderId)
        await lender.updateOne({notifications: [...lender.notifications, _id]})      
    },
    addNotificationIdToTenant: async ({notification, res}) => {
        const { _id, tenantId } = notification
        const tenant = await Tenant.findById(tenantId)
        await tenant.updateOne({notifications: [...tenant.notifications, _id]}) 
    }
}