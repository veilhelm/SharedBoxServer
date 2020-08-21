const { Schema ,model} = require("mongoose");

const spaceSchema = new Schema ({
    
    area:{
        type:Number,
        default:0,
        required:true,
        min:0
    },
    width:{
        type:Number,
        default:0,
        required:true,
        min:0
    },
    length:{
        type:Number,
        default:0,
        required:true,
        min:0
    },
    height:{
        type:Number,
        default:0,
        required:true,
        min:0
    },
    pricePerDay:{
        type:Number,
        default:0,
        required:true,
        min:0
    },
    pricePermonth:{
        type:Number,
        default:0,
        min:0
    },
    dateReservedId:{
        type:[Schema.Types.ObjectId],
        ref:"DatesReserved"
    },
    spaceTags:{
        type:[Schema.Types.ObjectId],
        ref:"SpaceTag"
    },
    aditionalInfo:{
        type:String        
    },
    inventoryId:{
        type:Schema.Types.ObjectId,
        ref:"Inventory"
    },
    lenderId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"Lender"
    },
    tenantId:{
        type:Schema.Types.ObjectId,
        ref:"Tenant"
    },
    city:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    latitude:{
        type:Number        
    },
    longitude:{
        type:Number        
    }    
},{
    timestamps:true
})
spaceSchema.methods.monthCalculation = function(){
    this.pricePermonth = this.pricePerDay * 30
}
const space = new model("Space",spaceSchema)
module.exports = space