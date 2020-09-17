const eventEmiter = require('events')
const notification = require('../models/notification.model')
const Notification = require('../models/notification.model')
const NotificationSubscribers = require("../subscribers/notification.subscribers")

class NotificationServices extends eventEmiter{

  createNotification = async (req,res) => {
      const notificationData = (({lenderId,tenantId,inventoryId,events,chats,datesReservedId})=>({lenderId,tenantId,inventoryId,events,chats,datesReservedId}))(req.body)   
      try{
          const notification = await new Notification(notificationData)         
          this.emit("notificationCreatedLender", {notification,res} )
          this.emit("notificationCreatedTenant", {notification,res} )
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
    .populate({path:"inventoryId",populate:{path:"elements",select:["quantity","value","object","description"]}})    
    .populate({path:"inventoryId",select:["elements","spaceId","datesReservedId"],populate:{path:"spaceId",select:["pricePerDay","title"]}})
    .populate("datesReservedId",["initialDate","finalDate"])
    .populate("tenantId",["name","phoneNumber"])
    .populate("lenderId",["name","phoneNumber"])
    
    res.status(200).json(notifications)
  }
}
const notificationServices = new NotificationServices()
notificationServices.on('notificationCreatedLender',NotificationSubscribers.addNotificationIdToLender)
notificationServices.on('notificationCreatedTenant',NotificationSubscribers.addNotificationIdToTenant)
module.exports = notificationServices