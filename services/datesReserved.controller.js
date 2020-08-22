const EventEmitter = require("events");
const DateReserved = require("../models/dateReserved.model");

class DateService extends EventEmitter {
  createNewDate = async (req,res) => {
    console.log(req)
    const dateData  = (({ spaceId, initialDate, finalDate, tenantId}) => ({spaceId, initialDate, finalDate, tenantId}))(req.body);
    try {
      const newDate = await new DateReserved(dateData);
      console.log(newDate)
      //this.emit("dateCreated", newDate ) 
      await newDate.save();
      res.status(201).json(newDate)
    } catch(err) {
      res.status(400).json(err.message)
    }
  }
  getDate = async (req, res) => {
    console.log(req.body)
    const date  = await DateReserved.find({spaceId: req.body.spaceId,tenantId:req.body.tenantId});
    res.status(200).json(date)   
  }
}

const dateService = new DateService();
spaceServices.on('dateCreated',spaceSubscribers.addSpaceIdToLender)

module.exports = dateService