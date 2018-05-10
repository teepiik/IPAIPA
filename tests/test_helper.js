const Beer = require('../models/beer')
const User = require('../models/user')

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

const usersInDatabase = async () => {
    const users = await User.find({})
    return users
}

const userWithIdFromDatabase = async (id) => {
    const user = await User.findById(id)
    return user
}

module.exports = { initialBeers, beersInDatabase, usersInDatabase, userWithIdFromDatabase }