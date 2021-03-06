const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");

const DateReservedSchema = new Schema({
  spaceId: {
    type: Schema.Types.ObjectId,
    //required: true,
    ref: "Space"
  },
  initialDate: {
    type: String,
    required: true
  },
  finalDate: {
    type: String,
    required: true
  },
  tenantId: {
    type: Schema.Types.ObjectId,
    //required: true,
    ref: "Tenant"
  }
},{
  timestamps: true
} );

const DateReserved = new model("DatesReserved", DateReservedSchema);

module.exports = DateReserved;