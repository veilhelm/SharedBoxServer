const Lender = require('../models/lender.model')
const Tenant = require('../models/tenant.model')
const Inventory = require('../models/inventory.model')
const Space = require('../models/space.model')
const {sendReservationEmailToLender, sendOfferRejectionEmailToTenant, sendOfferAcceptedEmailToTenant,sendPayResultEmailToTenant} = require("../utils/email")
const DateReserved = require('../models/dateReserved.model')
const { setReminderDayBefore } = require('../utils/reminder')

module.exports = {
    
    addNotificationIdToLender: async ({notification, res}) => {  
        try{      
            const { _id, lenderId, inventoryId, tenantId, datesReservedId} = notification;
            const inv = await Inventory.findById(inventoryId).populate("spaceId",["title"])
            const date = await DateReserved.findById(datesReservedId)
            const spaceTitle = inv.spaceId.title
            const lender = await Lender.findById(lenderId)
            const tenant = await Tenant.findById(tenantId)
            await lender.updateOne({notifications: [...lender.notifications, _id]})                   
            await sendReservationEmailToLender(lender,tenant,spaceTitle)
            await setReminderDayBefore("lender",date,lender,tenant,spaceTitle)
        }catch(err){
            console.log(err.message)
        }
    },
    addNotificationIdToTenant: async ({notification, res}) => {
        try {
            const {  _id, lenderId, tenantId, inventoryId, datesReservedId } = notification
            const inv = await Inventory.findById(inventoryId).populate("spaceId",["title"])
            const date = await DateReserved.findById(datesReservedId)
            const spaceTitle = inv.spaceId.title
            const lender = await Lender.findById(lenderId)
            const tenant = await Tenant.findById(tenantId)
            await tenant.updateOne({notifications: [...tenant.notifications, _id]})            
            await setReminderDayBefore("tenant",date,lender,tenant,spaceTitle)  
        } catch(err) {
            console.log(err.message)
        }
    },

    offerRejected: async({titleSpace,tenant,nameLender}) => {        
        try{   
            await sendOfferRejectionEmailToTenant(titleSpace,tenant,nameLender)
        } catch(err){
            console.log(err.message)
        }
    },

    offerAccepted: async({titleSpace,initialDate,finalDate,tenant,nameLender}) => {
        
        try {  
            sendOfferAcceptedEmailToTenant(titleSpace,initialDate,finalDate,tenant,nameLender) 
        }catch(err){
            console.log(err.message)
        }
    },

    addDateToSpace: async({datesReservedId,spaceId}) => {
        const space = await Space.findById(spaceId)
        space.dateReservedId.push(datesReservedId)
        await space.save({validateBeforeSave:false})
    },

    offerPaid: async({titleSpace,initialDate,finalDate,tenant,nameLender}) => {
        try{   
            await sendPayResultEmailToTenant(titleSpace,initialDate,finalDate,tenant,nameLender)
        }catch(err){
            console.log(err.message)
        }
    }
}