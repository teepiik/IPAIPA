const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    passwordHash: String,
    beersAdded: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Beer' }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
})

userSchema.statics.format = (user) => {
    return {
        id: user.id,
        username: user.username,
        beersAdded: user.beersAdded,
        reviews: user.reviews
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User