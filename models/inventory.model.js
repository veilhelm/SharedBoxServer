const { Schema, model } = require("mongoose");

const InventoryShema = new Schema({
    
    spaceId:{
        type:Schema.Types.ObjectId
    },
    products:{
        type:[{type:Schema.Types.ObjectId, ref:"product"}]
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
const inventory = new model("Invetory",InventoryShema)
module.exports = inventory