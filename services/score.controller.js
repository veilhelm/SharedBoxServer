const EventEmiter = require("events");
const Score = require("../models/score.model");
const ScoreSubscribers = require("../subscribers/score.subscribers");

class ScoreService extends EventEmiter {
  createNewScore = async (req,res) => {
    const scoreData = (({giverId, receiverId, score}) => ({giverId, receiverId, score}))(req.body);
    try {
      const newScore = await new Score(scoreData);
      this.emit("scoreCreated", {newScore, res})
      await newScore.save();
      res.status(201).json(newScore)
    } catch (err){
      res.status(400).json(err.message)
    }
  }
}

const scoreService = new ScoreService();
scoreService.on('scoreCreated',ScoreSubscribers.addScoreToPeople);

module.exports = scoreService