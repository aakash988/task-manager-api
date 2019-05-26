const mongoose = require('mongoose')

//use mongoose to connect to mongo db
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
