require("dotenv").config({path: __dirname + '/.env.dev'})
const express = require ("express")
const cors = require("cors")
const lenderRouter = require("./routes/lender.route")


//stablish DB connection
const db = require("./config/dbConnection")
db()

const app = express()

//setUp express app
app.use(express.json())
app.use(cors())

//setUp all routers
app.use("/lender", lenderRouter)

module.exports = app