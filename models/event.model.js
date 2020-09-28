const {Schema, model} = require("mongoose")

const eventSchema = new Schema({
    type:{
        type: String,
        default: "application-event",
        validate:{
            validator: function(value) {
                return ["element-rejected", "element-updated", "application-event"].includes(value)
            },
            message: "invalid type of event"
        }
    },
    objectAffected:{
        type: [{type: Schema.Types.ObjectId, ref: this.typeOfObjectAffected}]
    },
    typeOfObjectAffected:{
        type: String
    },
    message:{
        type: String,
        required: true,
    },
})

const event = new model("Event", eventSchema)
module.exports = event
