const express = require('express')
require('./db/mongoose')

//initiate express to create API endpoints
const app = express()
const port = process.env.PORT

//require routers that are used to create endpoints
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

//routers for express
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app