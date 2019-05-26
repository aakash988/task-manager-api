const mongoose = require('mongoose')
const validator = require('validator')

//creates schema for tasks that are stored in db using mongoose
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true

    }, 
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
