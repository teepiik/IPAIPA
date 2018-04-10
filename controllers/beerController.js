const beerRouter = require('express').Router()
const Beer = require('../models/beer')
const axios = require('axios')

beerRouter.get('/', async (request, response) => {
    try {
        const beers = await Beer.find({})
        response.status(200).json(beers.map(Beer.format))

    } catch (error) {
        console.log(error)
        response.status(500).send({ error: 'internal error'})
    }
})

beerRouter.post('/', async (request, response) => {
    try {
        const body = request.body
        if(body === undefined) {
            return response.status(400).json({ error: 'content missing'})
        }

        const beer = new Beer({
            name: body.name,
            brewery: body.brewery,
            type: body.type,
            country: body.country,
            alcohol_percent: body.alcohol_percent
        })

        savedBeer = await beer.save()
        response.status(200).send(Beer.format(savedBeer))

    } catch (error) {
        console.log(error)
        response.status(500).send({ error: 'internal error'})
    }
})

module.exports = beerRouter