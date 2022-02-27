const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
app.use(cookieParser())
app.use(cors())



app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "localhost:3001");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


module.exports = app


