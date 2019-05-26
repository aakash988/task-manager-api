// const mongodb = require('mongodb') //native driver
// const MongoClient = mongodb.MongoClient
// // const ObjectID = mongodb.ObjectID

// const { MongoClient, ObjectID } = require('mongodb')

// const connectionURL = 'mongodb://127.0.0.1:27017' 
// const databaseName = 'task-manager'


// MongoClient.connect(connectionURL, { useNewUrlParser: true },  (error, client) => { //connects to specific server
//     if (error) {
//         return console.log('Unable to connect to database')
//     }

//     const db = client.db(databaseName)
    
//     client.db(databaseName) //connects to specific database
// })