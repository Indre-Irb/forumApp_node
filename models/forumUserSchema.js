const mongoose = require('mongoose')

const Schema = mongoose.Schema

const forumUserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    postCount: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('forumUserDb', forumUserSchema)