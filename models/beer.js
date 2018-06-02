const mongoose = require('mongoose')

// add users tasted

const beerSchema = new mongoose.Schema({
    name: String,
    brewery: String,
    type: String,
    country: String,
    alcohol_percent: String,
    userWhoAdded: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
})

beerSchema.statics.format = (beer) => {
    return {
        id: beer.id,
        name: beer.name,
        type: beer.type,
        brewery: beer.brewery,
        country: beer.country,
        alcohol_percent: beer.alcohol_percent,
        userWhoAdded: beer.userWhoAdded,
        reviews: beer.reviews
    }
}

const Beer = mongoose.model('Beer', beerSchema)
module.exports = Beer