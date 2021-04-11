import express from "express"
import morgan from "morgan"
import bodyParser from "body-parser"
import cors from "cors"

let app = express()
const PORT = 4040

let server = require("http").Server(app)
let io = require("socket.io")(server)
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api/v1/documentation/swagger.json');

// api routes
let api = require("./api/v1/api")

// middleware
app.use(cors())

app.use(morgan("tiny"))
app.use(express.static("private"))
app.use('/op/api/v1/documentation.html', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({limit: '5mb', extended: false}))
app.set("json spaces", 2)


app.get("/admin", (req, res) =>{
    res.status(200).json({"name": "harry"})
})

// register api routes on app
app.use("/op/api/v1", api)




server.listen(PORT, async () => {
    console.log("listening on port: ", PORT)
})




