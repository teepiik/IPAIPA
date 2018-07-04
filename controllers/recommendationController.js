const recommendationRouter = require('express').Router()
const Beer = require('../models/beer')
const User = require('../models/user')
const Recommendation = require('../models/recommendation')
const axios = require('axios')
const jwt = require('jsonwebtoken')

const getToken = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

recommendationRouter.get('/', async (request, response) => {
    try {
        const recommendations = await Recommendation.find({})
            .populate('users')
            .populate('beers')

        response.status(200).json(recommendations.map(Recommendation.format))

    } catch (error) {
        console.log(error)
        response.status(500).json({ error: 'internal error' })
    }
})

recommendationRouter.post('/', async (request, response) => {
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

        const userWhoGave = await User.findById(decodedToken.id)
        const recommendatedUser = await User.findById(body.recommendatedUser)
        const beer = await Beer.findById(body.recommendatedBeer)

        const recommendation = new Recommendation({
            userWhoGave: userWhoGave,
            recommendatedUser: recommendatedUser,
            recommendatedBeer: beer,
            date: body.date,
            comments: body.comments,
            tasted: false // new rec false by default
        })

        const savedRecommendation = await recommendation.save()
        recommendatedUser.recommendations = recommendatedUser.recommendations.concat(savedRecommendation._id)
        await recommendatedUser.save()

        response.status(201).json(Recommendation.format(savedRecommendation))

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            response.status(401).json({ error: error.message })
            console.log('webtokenError')
        } else {
            console.log(error)
            response.status(500).json({ error: 'internal error' })
        }
    }
})

recommendationRouter.put('/:id', async (request, response) => {
    const body = request.body

    try {
        const token = getToken(request)
        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        // Checks if updater is the original recommender or not
        if (decodedToken.id !== body.userWhoGave) {
            return response.status(401).json({ error: 'no permission' })
        }

        const recommendationToUpdate = {
            userWhoGave: body.userWhoGave,
            recommendatedUser: body.recommendatedUser,
            recommendatedBeer: body.recommendatedBeer,
            date: body.date,
            comments: body.comments,
            tasted: body.tasted
        }

        const updatedRecommendation = await Recommendation.findByIdAndUpdate(request.params.id, recommendationToUpdate, { new: true })
        response.status(200).json(Recommendation.format(updatedRecommendation))

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            response.status(401).json({ error: error.message })
        } else {
            console.log(error)
            response.status(500).json({ error: 'internal error' })
        }
    }
})

module.exports = recommendationRouter