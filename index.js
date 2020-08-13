const app = require("./app")

const port = process.env.DB_PORT || 8000

app.listen( port, () => {
    console.log(`listening at port ${port}`)
}) 