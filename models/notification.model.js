const { Schema ,model} = require("mongoose");
const Inventory = require("./inventory.model")
const Element = require("./elements.model")

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

notificationSchema.post("save",async function(){
 const [inventory] = await Inventory.find({_id:this.inventoryId})
 const elements = await Element.find({_id:{$in:inventory.elements}})
 if (elements.every(element=>element.status==="element-accepted")){
    this.status="element-accepted"
    await this.save({validateBeforeSave: false})
 }
})
const notification = new model("Notification",notificationSchema)
module.exports = notification