const eventEmiter = require('events')
const notification = require('../models/notification.model')
const Notification = require('../models/notification.model')
const Tenant = require('../models/tenant.model')
const NotificationSubscribers = require("../subscribers/notification.subscribers")

class NotificationServices extends eventEmiter{

  createNotification = async (req,res) => {         
      try{
          const notificationData = (({lenderId,tenantId,inventoryId,events,chats,datesReservedId})=>({lenderId,tenantId,inventoryId,events,chats,datesReservedId}))(req.body)
          const notification = await new Notification(notificationData)    
          if(req.header("x-UserType")){
            this.emit("notificationCreatedLender", {notification,res} )
            this.emit("notificationCreatedTenant", {notification,res} )
          } 
          await notification.save()
          res.status(200).json(notification)
      } catch(err){
          res.status(400).json(err.message)
      }
  }  
  getNotification = async(req,res) => {
    const userId = req.user._id
    const userType = req.header("x-UserType")  === "tenant" ? "tenantId" : "lenderId"
    const notifications = await Notification.find({[userType]: userId})
    .populate({path:"inventoryId",populate:{path:"elements"}})    
    .populate({path:"inventoryId",select:["elements","spaceId","datesReservedId"],populate:{path:"spaceId"}})
    .populate("datesReservedId",["initialDate","finalDate"])
    .populate("tenantId",["name","phoneNumber"])
    .populate("lenderId",["name","phoneNumber"])
    res.status(200).json(notifications)
  }

  updateNotification = async(req,res) => {
    const userId = req.user._id
    const {status,notification} = req.body


    if(typeof(notification)==='string'){

      const notifications = await Notification.findById(notification)
      .populate({path:"inventoryId",populate:{path:"spaceId",select:["title"]}})
      .populate("datesReservedId",["initialDate","finalDate"])
      .populate("tenantId",["name","email"])
      .populate("lenderId",["name","phoneNumber"])
      
      let titleSpace = notifications.inventoryId.spaceId.title
      let initialDate = notifications.datesReservedId.initialDate
      let finalDate = notifications.datesReservedId.finalDate
      let tenant = notifications.tenantId
      let lender = notifications.lenderId
      
      this.emit("offerPaid",{titleSpace,initialDate,finalDate,tenant,lender})
    }
    else if(typeof(notification)==='object'){
      let spaceId = notification.inventoryId.spaceId._id
      let titleSpace = notification.inventoryId.spaceId.title
      let initialDate = notification.datesReservedId.initialDate
      let finalDate = notification.datesReservedId.finalDate
      let idTenant = notification.tenantId._id
      let nameLender = notification.lenderId.name
      let datesReservedId = notification.datesReservedId._id
      const tenant = await Tenant.findById(idTenant)
      if(status==="accept"){
        this.emit("offerAccepted",{titleSpace,initialDate,finalDate,tenant,nameLender})
        this.emit("dateUpdating",{datesReservedId,spaceId})
      } 
      if(status==="reject") this.emit("offerRejected",{titleSpace,tenant,nameLender})
    }
    
    const notificationUpdate = await Notification.update(typeof((notification)==='string') ? {_id:notification} : {_id:notification._id},{status: status})
    res.status(200).json(notificationUpdate)
  }
}
const notificationServices = new NotificationServices()
notificationServices.on('offerPaid',NotificationSubscribers.offerPaid)
notificationServices.on('dateUpdating',NotificationSubscribers.addDateToSpace)
notificationServices.on('offerRejected',NotificationSubscribers.offerRejected)
notificationServices.on('offerAccepted',NotificationSubscribers.offerAccepted)
notificationServices.on('notificationCreatedLender',NotificationSubscribers.addNotificationIdToLender)
notificationServices.on('notificationCreatedTenant',NotificationSubscribers.addNotificationIdToTenant)
module.exports = notificationServices