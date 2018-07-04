const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const getToken = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

// adding users is designed to be handled by admin, no purpose build UI needed.
// 
usersRouter.post('/', async (request, response) => {

    if (request.body.activation !== config.activationCode) {
        return response.status(400).json({ error: 'you need activation code to register new user' })
    }

    try {
        const body = request.body
        const users = await User.find({})
        const usernames = users.map(user => user.username)
        if (usernames.includes(body.username)) {
            return response.status(400).json({ error: 'username must be unique' })
        }

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
        response.status(500).json({ error: 'internal server error' })
    }
})

usersRouter.get('/', async (request, response) => {
    try {
        const users = await User.find({})
           // .populate('beers') propably not needed
        response.status(200).json(users.map(User.format))

    } catch (error) {
        console.log(error)
        response.status(500).json({ error: 'internal server error' })
    }
})

usersRouter.get('/:id', async (request, response) => {
    try {
        const user = await User.findById(request.params.id)
            .populate('beers')
            .populate('reviews')
            .populate('recommendations')
        response.status(200).json(User.format(user))

    } catch (error) {
        console.log(error)
        response.status(500).json({ error: 'internal server error' })
    }
})

// implement that user can only update own account
usersRouter.put('/:id', async (request, response) => {
    const body = request.body
    try {
        const token = getToken(request)
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const userToUpdate = {
            username: body.username,
            passwordHash: passwordHash,
            beersAdded: body.beersAdded,
            reviews: body.reviews,
            recommendations: body.recommendations
        }

        const updatedUser = await User.findByIdAndUpdate(request.params.id, userToUpdate, { new: true })
        response.status(200).json(User.format(updatedUser))

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            response.status(401).json({ error: error.message })
        } else {
            console.log(error)
            response.status(500).json({ error: 'internal server error' })
        }
    }
})
// implement that user can only delete own account
usersRouter.delete('/:id', async (request, response) => {
    try {
        const token = getToken(request)
        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
        const deletedUser = await User.findByIdAndRemove(request.params.id)
        response.status(204).end()

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            response.status(401).json({ error: error.message })
        } else {
            console.log(error)
            response.status(500).json({ error: 'internal error' })
        }
    }
})

module.exports = usersRouter