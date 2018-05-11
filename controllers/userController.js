const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const config = require('./utils/config')

require('dotenv').config()

// adding users is designed to be handled by admin, no purpose build UI needed.
// 
usersRouter.post('/', async (request, response) => {

    if (request.body.activation !== config.activationCode) {
        return response.status(400).json({ error: 'you need activation code to register new user' })
    }

    try {
        const body = request.body
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            passwordHash
        })

        const savedUser = await user.save()
        response.status(200).json(savedUser)

    } catch (error) {
        console.log(error)
        response.status(500).json({ error: 'something went wrong' })
    }
})

usersRouter.get('/', async = () => {
    try {
        const users = await User.find({})
        response.status(200).json(users.map(User.format))

    } catch (error) {
        console.log(error)
        response.status(500).json({ error: 'internal error' })
    }
})

usersRouter.get('/:id', async = (id) => {
    try {
        const user = await User.findById(id)
        response.status(200).json(User.format(user))

    } catch (error) {
        console.log(error)
        response.status(500).json({ error: 'internal error' })
    }
})

module.exports = usersRouter