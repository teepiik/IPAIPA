const reviewRouter = require('express').Router()
const Beer = require('../models/beer')
const User = require('../models/user')
const Review = require('../models/review')
const axios = require('axios')
const jwt = require('jsonwebtoken')

const getToken = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

reviewRouter.get('/', async (request, response) => {
    try {
        const reviews = await Review.find({})
            .populate('users')
            .populate('beers')

        response.status(200).json(reviews.map(Review.format))

    } catch (error) {
        console.log(error)
        response.status(500).json({ error: 'internal error' })
    }
})

reviewRouter.get('/:id', async (request, response) => {
    try {
        const review = await Review.findById(request.params.id)
            .populate('users')
            .populate('beers')

        if (review !== null && review !== undefined) {
            response.status(200).json(Review.format(review))
        } else {
            response.status(404).end()
        }

    } catch (error) {
        console.log(error)
        response.status(500).json({ error: 'internal error' })
    }
})

reviewRouter.post('/', async (request, response) => {
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
        // add beerId, body.beer

        const review = new Review({
            userWhoViewed: decodedToken.id,
            //reviewedBeer: beer,
            overall_grade: body.overall_grade,
            after_taste: body.after_taste,
            first_bite: body.first_bite,
            date: body.date,
            comments: body.comments
        })

        const savedReview = await review.save()
        user.reviews = user.reviews.concat(savedReview._id)
        await user.save()

        response.status(201).json(Review.format(savedReview))

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            response.status(401).json({ error: error.message })
        } else {
            console.log(error)
            response.status(500).json({ error: 'internal error' })
        }
    }
})

reviewRouter.put('/:id', async (request, response) => {
    const body = request.body

    try {
        const token = getToken(request)
        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
/*
        May not be needed
        const updater = await User.findById(decodedToken.id)
        const orginalReviewer = User.findById(body.userWhoViewed)
*/
        // Checks if updater is the original reviewer or not
        if(decodedToken.id !== body.userWhoViewed) {
            return response.status(401).json({ error: 'no permission' })
        }

        const reviewToUpdate = {
            userWhoViewed: user,
            //reviewedBeer: beer,
            overall_grade: body.overall_grade,
            after_taste: body.after_taste,
            first_bite: body.first_bite,
            date: body.date,
            comments: body.comments
        }
        const updatedReview = await Review.findByIdAndUpdate(request.params.id, reviewToUpdate, { new: true})
        response.status(200).json(Review.format(updatedReview))

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            response.status(401).json({ error: error.message })
        } else {
            console.log(error)
            response.status(500).json({ error: 'internal error' })
        }
    }
})

module.exports = reviewRouter