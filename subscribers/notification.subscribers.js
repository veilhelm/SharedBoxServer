const Lender = require('../models/lender.model')
const Tenant = require('../models/tenant.model')
const Inventory = require('../models/inventory.model')
const sgMail = require("../utils/email")



module.exports = {
    
    addNotificationIdToLender: async ({notification, res}) => {      
        const { _id, lenderId, inventoryId, tenantId} = notification
        const spaceTitle = Inventory.findById(inventoryId).populate("spaceId",["title"])
        const lender = await Lender.findById(lenderId)
        const tenant = await Tenant.findById(tenantId)
        await lender.updateOne({notifications: [...lender.notifications, _id]})
        const mail = {
            to: `${lender.email}`,
            from: 'sharedbox.tech@gmail.com',
            subject: `Hi ${lender.name}!! your space has a request for reservation in SharedBox!`,
            text: `Dear ${lender.name}, we are glad to tell you that your space ${spaceTitle} has a reservation request
                   from ${tenant.name}`,
            html: `<strong>Checkout your Notifications center in <a href=${process.env.SHARED_BOX_URL}>www.SharedBox.com</a> where you would be able to accept or reject ${tenant.name}'s offer</strong>`,
        }
        try{   
            await sgMail.send(mail)
        }catch(err){
            console.log(err)
        }
    },
    addNotificationIdToTenant: async ({notification, res}) => {
        const { _id, tenantId } = notification
        const tenant = await Tenant.findById(tenantId)
        await tenant.updateOne({notifications: [...tenant.notifications, _id]})
    }
}