const express = require('express')
const router = express.Router()

const {
    userRegistration,
    userLogin,
    newTopic,
    getAllPosts,
    openOneTopic,
    publishReply,
    changeProfilePhoto,
    getMyPost,
    getMyTopics,
    getPhoto,
    userLogout,
    closeNotific
} = require('../controllers/main')
const {validateRegistration, checkTopic, checkReply} = require('../middleware/main')

router.post('/register', validateRegistration, userRegistration)
router.post('/login', userLogin)
router.post('/writeTopic', checkTopic, newTopic)
router.post('/replies', checkReply, publishReply)
router.post('/changePhoto', changeProfilePhoto)

router.get('/allPosts', getAllPosts)
router.get('/openTopic/:id/:pageIndex', openOneTopic)
router.get('/myPost/:id', getMyPost)
router.get('/myTopics/:id', getMyTopics)
router.get(`/replyPhoto/:userId`, getPhoto)
router.get('/logout', userLogout)
router.get('/closeNotification/:id', closeNotific)

module.exports = router