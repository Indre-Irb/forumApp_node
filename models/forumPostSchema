const mongoose = require('mongoose')

const Schema = mongoose.Schema

const forumPostSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    post: {
        type: String,
        require:true
    },
    time: {
        type: String,
        require: true
    },
    userId: {
        type: String,
        require: true
    },
    isRead: {
        type: Boolean,
        require: true
    },
    commentCounter: {
        type: Number,
        default: 0,
        required: true
    }
})

module.exports = mongoose.model('forumPostDb', forumPostSchema)