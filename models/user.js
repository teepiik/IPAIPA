const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    passwordHash: String,
    beersAdded: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Beer' }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    recommendations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recommendation' }]
})

userSchema.statics.format = (user) => {
    return {
        id: user.id,
        username: user.username,
        beersAdded: user.beersAdded,
        reviews: user.reviews,
        recommendations: user.recommendations
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User