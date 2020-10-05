const { connection, connect } = require("mongoose")

function db () {
    //setUp of variables
    const uri = process.env.DB_URI || "mongodb://127.0.0.1:27017/sharedBox"

    const options = { 
        useNewUrlParser : true,
        useUnifiedTopology : true,
        useCreateIndex: true,
        useFindAndModify:false
    }

    //connect to database
    connect(uri, options)

    //functions triggered on connection
    connection.once("open", () => console.log("connection to database stablished"))
    connection.on("error", (err) => console.log("connection lost", err))
    
}
module.exports = db