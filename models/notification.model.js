const { Schema ,model} = require("mongoose");

const notificationSchema = new Schema ({
  lenderId:{
    type:Schema.Types.ObjectId,
    required: true,
    ref:"Lender"
  },
  tenantId:{
    type:Schema.Types.ObjectId,
    ref:"Tenant"
  },
  datesReservedId:{
    type:Schema.Types.ObjectId,
    ref:"DatesReserved"
  },
  inventoryId:{
    type: Schema.Types.ObjectId, 
    ref: "Inventory"
  },
  events:{
    type: [{type: Schema.Types.ObjectId, ref: "Event"}]
  },
  chats:{
    type: Schema.Types.ObjectId, ref: "Chat"
  },
  status:{
    type: String,
    default: "pending"
  }
},{
    timestamps:true
})

const notification = new model("Notification",notificationSchema)
module.exports = notification