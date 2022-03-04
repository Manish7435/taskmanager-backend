import express from 'express' 
import cors from 'cors'
import cookieParser from 'cookie-parser'
require('./db/mongoose')
import * as userRouter from './routers/user'
import  * as taskRouter from './routers/task'

const app = express()
app.use(cookieParser())
app.use(cors())



app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(function(req:any, res:any, next:any) {
    res.header("Access-Control-Allow-Origin", "localhost:3001");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


export default app


