const Lender = require('../models/lender.model')
const Tenant = require('../models/tenant.model')
module.exports = {
    addNotificationIdToLender: async ({notification, res}) => {      
      try {        
        const { _id, lenderId} = notification
        const lender = await Lender.findById(lenderId)
        await lender.updateOne({notifications: [...lender.notifications, _id]})
      } catch(err){
        res.status(400).json(err.message)
      }      
    },
    addNotificationIdToTenant: async ({notification, res}) => {
      try {
        const { _id, tenantId } = notification
        const tenant = await Tenant.findById(tenantId)
        await tenant.updateOne({notifications: [...tenant.notifications, _id]}) 
      } catch(err){
        res.status(400).json(err.message)
      }
    }
}