const valid = require('email-validator')

module.exports = {
    validateRegistration: async (req, res, next) => {
        const {name, email, pass1, pass2} = req.body
        if (!valid.validate(email)){
            return res.send({ success: false, message: "Email is not valid"})
        }
        if (name.length < 4 || name.length > 10){
            return res.send({success: false, message: "Name is too long or too short"})
        }
        if (pass1.length < 4 || pass1.length > 20) {
            return res.send({success: false, message: "Password is too long or too short"})
        }
        if (pass1 !== pass2) {
            return res.send({success: false, message: "Passwords don't match"})
        } else {
            next()
        }
    },
    checkTopic: async (req, res, next) => {
        const {topic} = req.body
        if (topic.length < 10 || topic.length > 50){
            return res.send({success: false, message: "Topic is too short or too long"})
        } else {
            next ()
        }
    },
    checkReply: async (req,res, next) => {
        const {comment} = req.body
        if(comment.length < 5 || comment.length > 500){
            return res.send({success: false, message: "Comment is too long or too short"})
        } else {
            next()
        }
    }
}