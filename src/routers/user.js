const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')


//this is an API endpoint that creates a user in the database
router.post('/users', async (req, res) => {
    const user = new User (req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

//this is an API endpoint that allows for the user to log in to the application
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error) {
        res.status(400).send()
    }
})

//this is an API endpoint that logs the user out of a session based on the access token sent in request
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

//this is an API endpoint that logs the user out of all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

//this is an API endpoint that gets users from the database
router.get('/users/me', auth, async (req,res) => {
   res.send(req.user)
})

//this is an API endpoint that updates the user that is logged in
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }
    try {
        const _id  = req.user._id
        const body = req.body
        //const user = await User.findById(_id)
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        //const user = await User.findByIdAndUpdate(_id, body, {new : true, runValidators: true})
        // if (!user) {
        //     return res.status(404).send()
        // } 
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

//this is an API endpoint that deletes current user's profie from the database
router.delete('/users/me', auth, async (req, res) => {
    const _id = req.user._id
    try {
        // const user = await User.findByIdAndDelete(_id)
        // if (!user) {
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

//this is a variable that uses multer to limit and filter file types for upload
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error ('Please upload valid file extension'))
        }
        cb (undefined, true)
    }
})

//this is an API endpoint that enables a user to upload a profile image
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    console.log(error)
    res.status(400).send({error: error.message})
})

//this is an API endpoint that enables a user to delete their profile picture
router.delete ('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res) => {
    res.status(400).send({error: error.message})
})

//this is an API endpoint that allows for anyone to access a profile picture based on user id
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error ()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})
module.exports = router