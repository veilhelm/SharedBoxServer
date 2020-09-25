const EventEmiter = require("events")
const subscriptionSubscribers = require("../subscribers/subscription.subscribers")
const Lender = require("../models/lender.model")
const Tenant = require("../models/tenant.model")
const crypto = require("crypto");
const webpush = require("web-push")
let subscriptions = {}

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
    const endpoint = subscriptions[subscriptionId].endpoint
    this.emit("createSubscription", {subscriptionId, subscriptionRequest, header: req.headers['x-usertype'], userId: req.user._id})
    res.status(201).json({ id: subscriptionId });
  }

  unRegisterSubscription = async (req,res) => {
    try{
      const subscriptionId = "";
    const endpoint = "";
    const p256dh = "";
    const auth = "";
    const userType = req.headers['x-usertype'] ? req.headers['x-usertype'] : "lender";
    const subscribedUser =  userType === "lender" ? 
                            await Lender.updateOne({_id: req.user._id},{subscriptionId, endpoint, p256dh, auth, isSubscribed: false}) : 
                            await Tenant.updateOne({_id: req.user._id},{subscriptionId,endpoint, p256dh, auth, isSubscribed: false})
    res.status(200).json(subscribedUser)
    } catch(err) {
      res.status(400).json(err.message);
    }    
  }

  isUserSubscribed = async (req,res) => {
    try {
      const subscriptionId = req.user.subscriptionId  
      const result = subscriptionId ? true : false      
      res.status(200).json(result)
    } catch(err){
      res.status(400).json(err.message);
    }
  }

  sendPushNotification = async (req,res) => {
    try {
      let subscriptions = {};
      const {title, text, image, tag, url} = req.body;
      const payload = JSON.stringify({
        title,
        text,
        image,
        tag,
        url
      })
      const subscriptionId = req.user.subscriptionId
      if (!subscriptionId){
        throw new Error('SubscriptionId not found');
      }     
      const subscriptionRequest = {
        endpoint: req.user.endpoint,
        expirationTime: null,
        keys: {
          p256dh: req.user.p256dh,
          auth: req.user.auth
        }
      }
      subscriptions[subscriptionId] = subscriptionRequest;
      const pushSubscription = subscriptions[subscriptionId];
      webpush
      .sendNotification(
        pushSubscription,
        payload
      )
      res.status(202).json({}); 
    } catch(err) {
      res.status(400).json(err.message);
    }
       
  }
}

const subscriptionServices = new SubscriptionServices()
subscriptionServices.on("createSubscription",subscriptionSubscribers.insertSubscriptionIntoUser)
module.exports = subscriptionServices