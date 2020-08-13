const express = require ("express")
const cors = require("cors")

//stablish DB connection
const db = require("./config/dbConnection")
db()

const app = express()

//setUp express app
app.use(express.json())
app.use(cors())

module.exports = app