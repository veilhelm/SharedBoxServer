const eventEmiter = require('events')
const Notification = require('../models/notification.model')
const NotificationSubscribers = require("../subscribers/notification.subscribers")

class NotificationServices extends eventEmiter{

  createNotification = async (req,res) => {
      const notificationData = (({lenderId,tenantId,inventoryId,events,chats})=>({lenderId,tenantId,inventoryId,events, chats}))(req.body)   
      try{
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
    const notifications = await Notification.find({lenderId: userId})
    res.status(200).json(notifications)
  }
}
const notificationServices = new NotificationServices()
notificationServices.on('notificationCreatedLender',NotificationSubscribers.addNotificationIdToLender)
notificationServices.on('notificationCreatedTenant',NotificationSubscribers.addNotificationIdToTenant)
module.exports = notificationServices