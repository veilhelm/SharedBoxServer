const Lender = require("../models/lender.model")
const Tenant = require("../models/tenant.model")

module.exports = {
  insertSubscriptionIntoUser: async({subscriptionId, header, userId }) => { 
    const userType = header ? header : "lender";
    const subscribedUser =  userType === "lender" ? await Lender.findOneAndUpdate({_id: userId},{subscriptionId, isSubscribed: true}) : await Tenant.findOneAndUpdate({_id: userId},{subscriptionId, isSubscribed: true})
  }

}