const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const DateSchema = new Schema({
  day: {
    type: Number,
    required: true,
    validate: {
      validator(value){
        if (value <= 0 && value > 31){
          return false
        }
      },
      message: "Day isn't in the valid range"
    }
  },
  month: {
    type: Number,
    required: true,
    validate: {
      validator: function(value){
        return (value <= 1 && value > 12)        
      },
      message: "Month isn't in the valid range"
    }
  }
},{
  timestamps: true
} );

const Date = new model("Date", DateSchema);

module.exports = Date;