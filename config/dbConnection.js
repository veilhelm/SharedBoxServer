const { connection, connect } = require("mongoose")

function db () {
    //setUp of variables
    const uri = process.env.DB_URI

    const options = { 
        useNewUrlParser : true,
        useUnifiedTopology : true,
        useCreateIndex: true
    }

    //connect to database
    connect(uri, options)

    //functions triggered on connection
    connection.once("open", () => console.log("connection to database stablished"))
    connection.on("error", (err) => console.log("connection lost", err))
    
}
module.exports = db