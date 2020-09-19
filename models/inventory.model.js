const { Schema, model } = require("mongoose");

const InventoryShema = new Schema({
    
    spaceId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    elements:{
        type:[{type:Schema.Types.ObjectId, ref:"Elements"}]
    },
    tenantId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    comment:{
        type:String,
    }
},{
    timestamps:true
})
const inventory = new model("Inventory",InventoryShema)
module.exports = inventory