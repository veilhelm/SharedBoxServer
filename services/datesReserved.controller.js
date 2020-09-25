const EventEmiter = require("events");
const DateReserved = require("../models/dateReserved.model");
const DateReservedSubscribers = require("../subscribers/dateReserved.subscribers");

class DateService extends EventEmiter {
  createNewDate = async (req,res) => {
    const dateData  = (({ spaceId, initialDate, finalDate, tenantId}) => ({spaceId, initialDate, finalDate, tenantId}))(req.body);
    try {
      const newDate = await new DateReserved(dateData);
      await newDate.save();
      res.status(201).json(newDate)
    } catch(err) {
      res.status(400).json(err.message)
    }
  }
  getDate = async (req, res) => {
    const date  = await DateReserved.find({spaceId: req.body.spaceId});
    res.status(200).json(date)   
  }
}

const dateService = new DateService();
dateService.on('dateCreated',DateReservedSubscribers.addDateToSpace)

module.exports = dateService