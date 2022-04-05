const mongoose = require('mongoose')

const Schema = mongoose.Schema

const forumCommentSchema = new Schema({
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
    postId: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('forumCommentDb', forumCommentSchema)