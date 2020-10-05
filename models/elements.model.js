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
    },
    status:{
        type: String,
        default: "pending",
        validate:{
            validator: function (value) {
                return ["pending","element-rejected","element-accepted","element-updated"].includes(value)
            },
            message: "invalid status for the element"
        }
    },
    comment:{
        type: String
    },
    errorCategory: {
        type: String,
        default: "select",
        validate:{
            validator: function (value){
                return ["select", "incorrect ammount","damaged product", "product not here", "incorrect product", "other"].includes(value)
            },
            message: "invalid category"
        }
    },

},{
    timestamps:true
})
const elements = new model("Elements",elementsSchema)
module.exports = elements