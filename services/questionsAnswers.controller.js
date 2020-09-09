const EventEmiter = require("events");
const QuestionAnswer = require("../models/questionAnswer.model");
const Space = require('../models/space.model')

class QuestionAnswerService extends EventEmiter {
  createNewQA = async (req,res) => {
    const{faqs} = req.body
    const spaceId = faqs[0].spaceId
    try {
      const newQA = await QuestionAnswer.insertMany(faqs);
      const space = await Space.findById(spaceId)
      newQA.forEach(faq => {
        space.faqs.push(faq._id)
      });
      await space.save()
      res.status(201).json(newQA)
    } catch(err) {
      res.status(400).json(err.message)
    }
  }
  getQA = async (req, res) => {
    const qa  = await QuestionAnswer.find(spaceId);
    res.status(200).json(qa)   
  }
}

const questionAnswerService = new QuestionAnswerService();

module.exports = questionAnswerService