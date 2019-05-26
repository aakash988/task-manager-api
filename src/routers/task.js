const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()

//require mongoose model to use as constructors in API endpoints
const Task = require('../models/tasks')

//this is an API endpoint that creates a task and stores it into the database
router.post('/tasks', auth, async (req, res) => {
    //const task = new Task (req.body)
    const task = new Task ({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

//this is an API endpoint that gets tasks from the db (also supports sorting, filtering, and pagination)
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    // const tasks = await Task.find({owner: req.user._id})
    // const user = await req.user.populate('tasks').execPopulate()
    try {
        await req.user.populate({
            path: 'tasks',
            match: match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})

//this is an API endpoint that gets a task by ID from the database
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (error) {
        res.status(500).send()
    }
})




//this is an API endpoint that updates a task in the database
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "completed"]
    const isValidOperation = updates.every((task) => allowedUpdates.includes(task))

    if (!isValidOperation) {
        return res.status(404).send({error: 'Invalid updates'})
    }
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        //const _id = req.params.id
        const body = req.body
        //const task = await Task.findById(_id)
        //const task = await Task.findByIdAndUpdate(_id, body, {new: true, runValidators: true})
        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

//this is an API endpoint that deletes a task by ID from the database
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        //const task = await Task.findByIdAndDelete(_id)
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router