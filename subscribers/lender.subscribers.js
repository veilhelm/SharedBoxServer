const Notification = require('../models/notification.model');
const Score = require('../models/score.model');
const Space = require("../models/space.model")

module.exports = {
    sendRegistrationEmail(){
        console.log("email send")
    },
    deleteLenderReferences: async(lender) => {
        const {notifications, scores, spaces} = lender;
        const deleteNotification = await Notification.deleteOne({_id: notifications}) 
        const deleteScore = await Score.deleteOne({ _id: score})    
        const deleteSpace = await Space.deleteOne({ _id: space})
    }
}