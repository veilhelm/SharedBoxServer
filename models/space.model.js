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
        type:[{type: Schema.Types.ObjectId, ref:"DatesReserved"}] 
    },
    spaceTags:{
        type:[{type:Schema.Types.ObjectId, ref:"SpaceTag"}]  
    },
    additionalInfo:{
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
        required: true,
        uppercase: true
    },
    address:{
        type:String,
        required: true,
        uppercase: true
    },
    latitude:{
        type:Number        
    },
    longitude:{
        type:Number        
    },
    title: {
        type: String,
        required: true,
        uppercase: true
    },
    photos: {
        type: [String]
    },
    frequentlyAskedQuestions:{
        type:[{type:Schema.Types.ObjectId, ref:"questionAnswer"}]  
    }, 
},{
    timestamps:true
})
spaceSchema.methods.monthCalculation = function(){
    this.pricePermonth = this.pricePerDay * 30
}
const space = new model("Space",spaceSchema)
module.exports = space
