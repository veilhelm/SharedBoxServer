const Lender = require("../models/lender.model")
const Tenant = require("../models/tenant.model")

module.exports = {
  insertSubscriptionIntoUser: async({subscriptionId, subscriptionRequest, header, userId }) => { 
    const {endpoint, keys} = subscriptionRequest
    const userType = header ? header : "lender";
    const subscribedUser =  userType === "lender" ? await Lender.findOneAndUpdate({_id: userId},{subscriptionId, endpoint, p256dh: keys.p256dh, auth: keys.auth, isSubscribed: true}) : await Tenant.findOneAndUpdate({_id: userId},{subscriptionId,endpoint, p256dh: keys.p256dh, auth: keys.auth, isSubscribed: true})
  }

}