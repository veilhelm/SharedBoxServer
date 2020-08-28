const EventEmiter = require("events");
const questionAnswer = require("../models/questionAnswer.model");

class QuestionAnswerService extends EventEmiter {
  createNewQA = async (req,res) => {
    const{newFaqs} = req.body
    try {
      const newQA = await questionAnswer.insertMany(newFaqs);
      res.status(201).json(newQA)
    } catch(err) {
      res.status(400).json(err.message)
    }
  }
  getQA = async (req, res) => {
    const qa  = await questionAnswer.find({spaceId: req.body.spaceId});
    res.status(200).json(qa)   
  }
}

const questionAnswerService = new QuestionAnswerService();

module.exports = questionAnswerService