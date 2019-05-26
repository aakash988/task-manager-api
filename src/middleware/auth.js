const jwt = require('jsonwebtoken')
const User = require ('../models/user.js')

//this function checks if the user is authorized to perform an action (used in user routers)
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({error: 'Please authenticate.'})
    }
}

module.exports = auth