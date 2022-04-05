const bcrypt = require('bcrypt')
const linkify = require('linkify')
const forumUserDb = require('../models/forumUserSchema')
const forumPostDb = require('../models/forumPostSchema')
const forumCommentDb = require('../models/forumCommentSchema')

const topicList = []
const commentList = []
const countPerPage = 10

module.exports = {
    userRegistration: async (req, res) => {
        const {name, email, pass1, pass2} = req.body
        const checkUser = await forumUserDb.findOne({email})
        if (checkUser) return res.send({success: false, message: "User is already exists"})

        const hash = await bcrypt.hash(pass1, 10)
        const user = new forumUserDb()
        user.username = name
        user.email = email
        user.pass = hash
        user.image = "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
        user.postCount = 0
        user.save().then(res => {
            console.log('user saved')
        })
        return res.send({success: true})
    },
    userLogin: async (req, res) => {
        const {email, pass} = req.body
        const checkUser = await forumUserDb.findOne({email})

        if (!checkUser) {
            res.send({success: false, message: "Bad Credentials"})
        } else {
            const compare = await bcrypt.compare(pass, checkUser.pass)
            if (email === checkUser.email && compare) {
                req.session.user = checkUser
                return res.send({success: true, checkUser})
            } else {
                res.send({success: false, message: "Bad credentials"})
            }
        }
    },
    newTopic: async (req, res) => {
        const {topic} = req.body
        const {user} = req.session
        if (user) {
            const newTopic = new forumPostDb()
            newTopic.username = user.username
            newTopic.post = topic
            newTopic.userId = user._id
            newTopic.isRead = false
            newTopic.time = new Date().toLocaleString('lt-LT')

            newTopic.save().then(data => {
                topicList.push(data)
                return res.send({success: true, data: topicList})
            })
        } else {
            return res.send({success: false, message: "Please login"})
        }
    },
    getAllPosts: async (req, res) => {
        const allPosts = await forumPostDb.find({})
        return res.send({success: true, allPosts})
    },
    openOneTopic: async (req, res) => {
        const {id, pageIndex} = req.params
        let skipIndex = 0;
        if (pageIndex > 1) {
            skipIndex = (Number(pageIndex) - 1) * countPerPage
        }

        const oneTopic = await forumPostDb.findOne({_id: id})
        if (oneTopic) {
            const findComments = await forumCommentDb.find({postId: id}).skip(skipIndex).limit(countPerPage)
            const findCommentCount = await forumCommentDb.count({postId: id})
            res.send({success: true, oneTopic, findComments, findCommentCount})
        } else {
            res.send({success: false})
        }
    },
    publishReply: async (req, res) => {
        const data = req.body
        const {user} = req.session

        const videoValid = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
        const imageValid = /\.(jpg|jpeg|png|gif|bmp)$/

        const linkText = data.comment.replace(/(https?\:\/\/)?([^\.\s]+)?[^\.\s]+\.[^\s]+/gi, (media) => {

            if (videoValid.test(media)) {
                const media1 =media.replace("watch?v=", "embed/")
                // media.replace("watch?v=", "embed/")
                console.log(media1)
                return `<iframe src=${media1}></iframe>`
            }
            if (imageValid.test(media)) {
                return `<img src=${media} alt/>`
            }
            if(!imageValid.test(media) && !videoValid.test(media)) {
                return `<a>${media}</a>`
            }
        })

        if (user) {
            await forumPostDb.findOneAndUpdate(
                {_id: data.postId},
                {$set: {isRead: true}},
                {new: true}
            )

            const newReply = new forumCommentDb()
            newReply.username = user.username
            newReply.postId = data.postId
            newReply.userId = user._id
            newReply.post = linkText
            // newReply.post = data.comment
            newReply.time = new Date().toLocaleString('lt-LT')

            newReply.save().then(data => {
                commentList.push(data)
                res.send({success: true, commentList})
            })
        } else {
            return res.send({success: false, message: "Please login"})
        }
    },
    changeProfilePhoto: async (req, res) => {
        const {user} = req.session
        const {id, photo} = req.body

        if (user) {
            const updatedUser = await forumUserDb.findOneAndUpdate({_id: id}, {$set: {image: photo}}, {new: true})
            return res.send({success: true, updatedUser})
        }
    },
    getMyPost: async (req, res) => {
        const {id} = req.params
        const {user} = req.session

        if (user) {
            const myPosts = await forumCommentDb.find({userId: id})
            res.send({success: true, myPosts})
        }

    },
    getMyTopics: async (req, res) => {
        const {id} = req.params
        const {user} = req.session

        if (user) {
            const myTopics = await forumPostDb.find({userId: id})
            res.send({success: true, myTopics})
        }
    },
    getPhoto: async (req, res) => {
        const {userId} = req.params
        const findUser = await forumUserDb.findOne({_id: userId})
        if (findUser) {
            res.send({success: true, findUser})
        }
    },
    userLogout: async (req, res) => {
        req.session.user = null
        res.send({success: true})
    },
    closeNotific: async (req, res) => {
        const {id} = req.params
        const {user} = req.session

        if (user) {
            await forumPostDb.findOneAndUpdate(
                {_id: id},
                {$set: {isRead: false}},
                {new: true}
            )
            res.send({success: true})
        }
    },
}