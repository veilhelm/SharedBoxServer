const EventEmitter = require("events");
const Date = require("../models/date.model");

class ModelService extends EventEmitter {
  createNewDate = async (req,res) => {
    const dateData  = (({ day, month}) => ({day, month}))(req.body);
    try {
      const newDate = await new Date(dateData);
      this.emit("dateCreated");
      res.status(201).json(dateData);
    } catch(err) {
      res.status(400).json(err.message)
    }
  }
}

const modelService = new ModelService();

module.exports = modelService