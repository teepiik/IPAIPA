const beerRouter = require('express').Router()
const Beer = require('../models/beer')
const axios = require('axios')

// implement user and login check

beerRouter.get('/', async (request, response) => {
    try {
        const beers = await Beer.find({})
        response.status(200).json(beers.map(Beer.format))

    } catch (error) {
        console.log(error)
        response.status(500).json({ error: 'internal error' })
    }
})

beerRouter.post('/', async (request, response) => {
    const body = request.body

    try {
        if (body === undefined) {
            return response.status(400).json({ error: 'content missing' })
        }

        const beer = new Beer({
            name: body.name,
            brewery: body.brewery,
            type: body.type,
            country: body.country,
            alcohol_percent: body.alcohol_percent
        })

        savedBeer = await beer.save()
        response.status(200).json(Beer.format(savedBeer))

    } catch (error) {
        console.log(error)
        response.status(500).json({ error: 'internal error' })
    }
})

beerRouter.delete('/:id', async (request, response) => {
    try {
        const beerToDelete = await Beer.findByIdAndRemove(request.params.id)
        response.status(204).end()

    } catch (error) {
        console.log(error)
        response.status(400).json({ error: 'something went wrong' })
    }
})

beerRouter.put('/:id', async (request, response) => {
    const body = request.body

    try {
        const beerToUpdate = {
            name: body.name,
            brewery: body.brewery,
            type: body.type,
            country: body.country,
            alcohol_percent: body.alcohol_percent
        }

        const updatedBeer = await Beer.findByIdAndUpdate(request.params.id, beerToUpdate, { new: true })
        response.status(200).json(Beer.format(updatedBeer))

    } catch (error) {
        console.log(error)
        response.status(400).json({ error: 'something went wrong' })
    }
})

module.exports = beerRouter