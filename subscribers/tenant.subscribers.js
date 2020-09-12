const Notification = require('../models/notification.model');
const Score = require('../models/score.model');

module.exports = {
    sendRegisterTenant(){
        console.log("registered tenant")
    },
    sendUpdateTenant(){
        console.log("update info tenant")
    },
    deleteTenantReferences: async(tenant) => {
        const {notifications, score} = tenant;
        const deleteNotification = await Notification.deleteOne({_id: notifications}) 
        const deleteScore = await Score.deleteOne({ _id: score})    
    }
}