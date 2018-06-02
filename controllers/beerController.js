const beerRouter = require('express').Router()
const Beer = require('../models/beer')
const User = require('../models/user')
const axios = require('axios')
const jwt = require('jsonwebtoken')

// implement user and login check

const getToken = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

beerRouter.get('/', async (request, response) => {
    try {
        const beers = await Beer.find({})
            .populate('users')
        response.status(200).json(beers.map(Beer.format))

    } catch (error) {
        console.log(error)
        response.status(500).json({ error: 'internal error' })
    }
})

beerRouter.get('/:id', async (request, response) => {
    try {
        const beer = await Beer.findById(request.params.id)
            .populate('users')

        if (beer !== null && beer !== undefined) {
            response.status(200).json(Beer.format(beer))
        } else {
            response.status(404).end()
        }

    } catch (error) {
        console.log(error)
        response.status(500).json({ error: 'internal error' })
    }
})

beerRouter.post('/', async (request, response) => {
    const body = request.body

    try {
        const token = getToken(request)
        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        if (body === undefined) {
            return response.status(400).json({ error: 'content missing' })
        }

        const user = await User.findById(decodedToken.id)

        const beer = new Beer({
            name: body.name,
            brewery: body.brewery,
            type: body.type,
            country: body.country,
            alcohol_percent: body.alcohol_percent,
            userWhoAdded: user._id, // id viite
            reviews: user.reviews
        })

        const savedBeer = await beer.save()
        user.beersAdded = user.beersAdded.concat(savedBeer._id)
        await user.save()

        response.status(201).json(Beer.format(savedBeer))

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            response.status(401).json({ error: error.message })
        } else {
            console.log(error)
            response.status(500).json({ error: 'internal error' })
        }
    }
})
// implement that only adder can delete. 
beerRouter.delete('/:id', async (request, response) => {
    try {
        const token = getToken(request)
        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        // implement adder or admin only can delete

        const beerToDelete = await Beer.findByIdAndRemove(request.params.id)
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

beerRouter.put('/:id', async (request, response) => {
    const body = request.body

    try {
        const token = getToken(request)
        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const beerToUpdate = {
            name: body.name,
            brewery: body.brewery,
            type: body.type,
            country: body.country,
            alcohol_percent: body.alcohol_percent,
            userWhoAdded: body.userWhoAdded,
            reviews: user.reviews
        }

        const updatedBeer = await Beer.findByIdAndUpdate(request.params.id, beerToUpdate, { new: true })
        response.status(200).json(Beer.format(updatedBeer))

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            response.status(401).json({ error: error.message })
        } else {
            console.log(error)
            response.status(500).json({ error: 'internal error' })
        }
    }
})

module.exports = beerRouter