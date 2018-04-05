const mongoose = require('mongoose')

// add users tasted

const beerSchema = new mongoose.Schema({
    name: String,
    brewery: String,
    type: String,
    country: String,
    alcohol_percent: String
})

beerSchema.static.format = (beer) => {
    return {
        id: beer.id,
        name: beer.name,
        brewery: beer.brewery,
        country: beer.country,
        alcohol_percent: beer.alcohol_percent
    }
}

const Beer = mongoose.model('Beer', beerSchema)
module.exports = Beer