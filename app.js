require("dotenv").config({path: __dirname + '/.env.dev'})
const express = require ("express")
const cors = require("cors")
const lenderRouter = require("./routes/lender.route")
const morgan = require("morgan")
const helmet = require("helmet")



//stablish DB connection
const db = require("./config/dbConnection")
db()

const app = express()

//setUp express app
app.use(express.json())
app.use(cors())
app.use(morgan("common"))
app.use(helmet())

//setUp all routers
app.use("/lender", lenderRouter)

//setUp all routers
app.use("/lender", lenderRouter)

module.exports = app