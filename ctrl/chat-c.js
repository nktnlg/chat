const errHandle = require('../tools/errHandle')
const Chat = require('../models/Chat-m')

module.exports.getAll = async function (req, res) {
    try {
        const chats = await Chat.find()
        res.status(200).json(chats)
    } catch (e) {
        errHandle(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const chat = await Chat.findById(req.params.id)
        res.status(200).json(chat)
    } catch (e) {
        errHandle(res, e)
    }
}

module.exports.new = async function (req, res) {
    //body shall have: title, message
    try {
        const chat = await new Chat({
            title: req.body.title,
            user: req.user.id,
            lastMessage: req.body.lastMessage
        }).save()
        res.status(201).json(chat)
    } catch (e) {
        errHandle(res, e)
    }
}

module.exports.update = async function (req, res) {
    try {
        const chat = await Chat.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        )
        res.status(200).json(chat)
    } catch (e) {
        errHandle(res, e)
    }
}

module.exports.delete = async function (req, res) {
    // req need chat id
    const candidate = await Chat.findOne({_id: req.params.id}).catch((error)=>{console.error(error)})
    if (candidate) {
        try {
            await Chat.deleteOne({_id: req.params.id})
                .then(res.status(200).json({message: 'item deleted'}))
        } catch (e) {
            errHandle(res, e)
        }
    } else {
        res.status(409).json({
            message: 'Chat doesnt exist'
        })
    }
}
