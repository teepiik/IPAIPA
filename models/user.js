const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    passwordHash: String,
    beersAdded: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Beer' }],
    //beersTasted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Beer' }]
})

userSchema.statics.format = (user) => {
    return {
        id: user.id,beers,
        username: user.username,
        beersAdded: user.beersAdded,
        //beersTasted: user.beersTasted CHANGE TO REVIEW
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User