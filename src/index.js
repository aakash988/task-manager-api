const app = require('./app')

const port = process.env.PORT

//Create server
app.listen(port, (req, res) => {
    console.log('Server is up on port ' + port)
})