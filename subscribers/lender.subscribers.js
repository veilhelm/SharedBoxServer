const sgMail = require("../utils/email")
const Notification = require('../models/notification.model');
const Score = require('../models/score.model');
const Space = require("../models/space.model")

module.exports = {
    sendRegistrationEmail: async(lender) =>{
        const mail = {
            to: `${lender.email}`,
            from: 'sharedbox.tech@gmail.com',
            subject: `welcome ${lender.name} to SharedBox!`,
            text: `thanks ${lender.name} for registring to SharedBox`,
            html: '<strong>hope you have fun!!!</strong>',
        }
        try{   
            await sgMail.send(mail)
        }catch(err){
            console.log(err)
        }
    },
    deleteLenderReferences: async(lender) => {
        const {notifications, scores, spaces} = lender;
        const deleteNotification = await Notification.deleteOne({_id: notifications}) 
        const deleteScore = await Score.deleteOne({ _id: scores})    
        const deleteSpace = await Space.deleteOne({ _id: spaces})
    }
}