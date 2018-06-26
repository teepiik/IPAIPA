const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    userWhoViewed: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    reviewedBeer: { type: mongoose.Schema.Types.ObjectId, ref: 'Beer'},
    usernameOfReviewer: String, // for frontend convenience
    overall_grade: Number,
    after_taste: Number,
    first_bite: Number,
    date: Date,
    comments: String
})

reviewSchema.statics.format = (review) => {
    return {
        id: review.id,
        userWhoViewed: review.userWhoViewed,
        reviewedBeer: review.reviewedBeer,
        usernameOfReviewer: review.usernameOfReviewer,
        overall_grade: review.overall_grade,
        after_taste: review.after_taste,
        first_bite: review.first_bite,
        date: review.date,
        comments: review.comments
    }
}

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review