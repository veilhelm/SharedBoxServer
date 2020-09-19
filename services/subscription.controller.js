const EventEmiter = require("events")
const subscriptionSubscribers = require("../subscribers/subscription.subscribers")
const Lender = require("../models/lender.model")
const Tenant = require("../models/tenant.model")
const crypto = require("crypto");
const webpush = require("web-push")
const subscriptions = {}


const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
}


webpush.setVapidDetails("mailto:example@yourdomain.org", vapidKeys.publicKey, vapidKeys.privateKey);

function createHash(input) {
  const md5sum = crypto.createHash("md5");
  md5sum.update(Buffer.from(input));
  return md5sum.digest("hex");
}

class SubscriptionServices  extends EventEmiter{
  registerSubscription = async (req,res) => {
    const subscriptionRequest = req.body;
    const subscriptionId = createHash(JSON.stringify(subscriptionRequest));
    subscriptions[subscriptionId] = subscriptionRequest;
    this.emit("createSubscription", {subscriptionId, header: req.headers['x-usertype'], userId: req.user._id})
    res.status(201).json({ id: subscriptionId });
  }

  unregisterSubscription = async (req,res) => {
    const subscriptionId = ""
    const userType = req.headers['x-usertype'] ? req.headers['x-usertype'] : "lender";
    const subscribedUser =  userType === "lender" ? await Lender.updateOne({_id: req.user._id},{subscriptionId, isSubscribed: false}) : await Tenant.updateOne({_id: req.user._id},{subscriptionId, isSubscribed: false})    
  }

  sendPushNotification = async (req,res) => {
    try {
      const subscriptionId = req.user.subscriptionId
      if (!subscriptionId){
        throw new Error('SubscriptionId not found');
      } 
      const pushSubscription = subscriptions[subscriptionId];
      webpush
      .sendNotification(
        pushSubscription,
        JSON.stringify({
          title: "Probando desde Local ",
          text: "HEY! Take a look at this brand new t-shirt!",
          image: "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg",
          tag: "new-product",
          url: "http://localhost:3000/user/login"
        })
      )
      .catch(err => {
        res.status(400).json(err.message);
      });
      res.status(202).json({}); 
    } catch(err) {
      res.status(400).json(err.message);
    }
       
  }
}

const subscriptionServices = new SubscriptionServices()
subscriptionServices.on("createSubscription",subscriptionSubscribers.insertSubscriptionIntoUser)
module.exports = subscriptionServices