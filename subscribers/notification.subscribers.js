const Lender = require('../models/lender.model')
const Tenant = require('../models/tenant.model')
const Inventory = require('../models/inventory.model')
const Space = require('../models/space.model')
const sgMail = require("../utils/email")



module.exports = {
    
    addNotificationIdToLender: async ({notification, res}) => {      
        const { _id, lenderId, inventoryId, tenantId} = notification
        const inv = await Inventory.findById(inventoryId).populate("spaceId",["title"])
        const spaceTitle = inv.spaceId.title
        const lender = await Lender.findById(lenderId)
        const tenant = await Tenant.findById(tenantId)
        await lender.updateOne({notifications: [...lender.notifications, _id]})
        const mail = {
            to: `${lender.email}`,
            from: 'sharedbox.tech@gmail.com',
            subject: `Hi ${lender.name}!! your space has a request for reservation in SharedBox!`,
            text: `Dear ${lender.name}, we are glad to tell you that your space ${spaceTitle} has a reservation request
                   from ${tenant.name}`,
            html: `<h4>Dear ${lender.name}, we are glad to tell you that your space ${spaceTitle} has a reservation request
            from ${tenant.name}</h4><br><br>
            <strong>Checkout your Notifications center in <a href=${process.env.SHARED_BOX_URL}>www.SharedBox.com</a> where you would be able to accept or reject ${tenant.name}'s offer</strong>`,
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
    },

    offerRejected: async({titleSpace,tenant,nameLender}) => {
        const mail = {
            to: `${tenant.email}`,
            from: 'sharedbox.tech@gmail.com',
            subject: `Hi ${tenant.name}!! your offer for the space${titleSpace} was rejected`,
            text: `Dear ${tenant.name}, we are sorry to tell you that your offer for the space ${titleSpace} was rejected by ${nameLender}`,
            html:`<h4>Dear ${tenant.name}, we are sorry to tell you that your offer for the space ${titleSpace} was rejected by ${nameLender}</h4><br><br>
            <strong>Checkout your Notifications center in <a href=${process.env.SHARED_BOX_URL}>www.SharedBox.com</a> and don't worry we will help you to find the best space for you</strong>`,
        }
        try{   
            await sgMail.send(mail)
        }catch(err){
            console.log(err)
        }
    },

    offerAccepted: async({titleSpace,initialDate,finalDate,tenant,nameLender}) => {
        const mail = {
            to: `${tenant.email}`,
            from: 'sharedbox.tech@gmail.com',
            subject: `Hi ${tenant.name}!! your offer for the space${titleSpace} was Accepted!!`,
            text: `Dear ${tenant.name}, we are glad to tell you that your offer for the space ${titleSpace} was accepted by ${nameLender}`,
            html:`<h4>Dear ${tenant.name}, we are glad to tell you that your offer for the space ${titleSpace} was accepted by ${nameLender}</br>from ${initialDate} to ${finalDate} </h4><br><br>
            <strong>Checkout your Notifications center in <a href=${process.env.SHARED_BOX_URL}>www.SharedBox.com</a> to see more information about your transaction</strong>`,
        }
        try{   
            await sgMail.send(mail)
        }catch(err){
            console.log(err)
        }
    },

    addDateToSpace: async({datesReservedId,spaceId}) => {
        const space = await Space.findById(spaceId)
        space.dateReservedId.push(datesReservedId)
        await space.save({validateBeforeSave:false})
    },

    offerPaid: async({titleSpace,initialDate,finalDate,tenant,nameLender}) => {
        const mail = {
            to: `${tenant.email}`,
            from: 'sharedbox.tech@gmail.com',
            subject: `Hi ${tenant.name}!! your transaction for the space${titleSpace} was Successful!!`,
            text: `Dear ${tenant.name}, we are glad to tell you that your offer for the space ${titleSpace} was successfully paid`,
            html:`<h4>Dear ${tenant.name}, we are glad to tell you that your transaction to rent the space ${titleSpace} was successfully taken by the Bank.
            </br>So from ${initialDate} to ${finalDate} the space is yours; congratulations!! be aware of your notifications on ${initialDate}, because the lender ${nameLender}
            is going to send you your inventory checklist.</h4><br><br>
            <strong>Checkout your Notifications center in <a href=${process.env.SHARED_BOX_URL}>www.SharedBox.com</a> to see more information about your transaction</strong>`,
        }
        try{   
            await sgMail.send(mail)
        }catch(err){
            console.log(err)
        }
    }
}