const {Schema, model} = require("mongoose")

const elementsSchema = new Schema({
    
    object:{
        type:String,
        required:true
    },
    category:{
        type:String
    },
    quantity:{
        type:Number,
        default:0
    },
    description:{
        type:String
    },
    tenantId:{
        type:Schema.Types.ObjectId,
        require:true
    },
    value:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})
const elements = new model("Elements",elementsSchema)
module.exports = elements