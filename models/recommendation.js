const mongoose = require('mongoose')

const recommendationSchema = new mongoose.Schema({
    userWhoGave: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    recommendatedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    recommendatedBeer: { type: mongoose.Schema.Types.ObjectId, ref: 'Beer'},
    date: Date,
    comments: String,
    tasted: Boolean
})

recommendationSchema.statics.format = (recommendation) => {
    return {
        id: recommendation.id,
        userWhoGave: recommendation.userWhoGave,
        recommendatedUser: recommendation.recommendatedUser,
        recommendatedBeer: recommendation.recommendatedBeer,
        date: recommendation.date,
        comments: recommendation.comments,
        tasted: recommendation.tasted
    }
}

const Recommendation = mongoose.model('Recommendation', recommendationSchema)
module.exports = Recommendation
