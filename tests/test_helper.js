const Beer = require('../models/beer')

const initialBeers = [
    {
        name: 'Koff',
        type: 'Lager',
        brewery: 'Sinebrychoff',
        country: 'Finland',
        alcohol_percent: '4,7'
        // userWhoAdded
    },
    {
        name: 'Modern Pils',
        type: 'Pilsner',
        brewery: 'Stadin Panimo',
        country: 'Finland',
        alcohol_percent: '5'
        // userWhoAdded
    },
    {
        name: 'King Henry',
        type: 'Barleywine',
        brewery: 'Goose Island Beer Co.',
        country: 'England',
        alcohol_percent: '13,4'
        // userWhoAdded
    }
]

const beersInDatabase = async () => {
    const beers = await Beer.find({})
    return beers
}

module.exports = { initialBeers, beersInDatabase }