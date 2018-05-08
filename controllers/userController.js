const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
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
        response.status(500).json({ error: 'something went wrong'})
    }
})

module.exports = usersRouter