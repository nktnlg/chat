const errHandle = require('../tools/errHandle')
const Message = require('../models/Message-m')

module.exports.getByChat = async function(req, res) {
    try { const message = await Message.find({chat: req.params.chatId})
        res.status(200).json(message)
    } catch(e) { errHandle(res, e) }
}
module.exports.new = async function(req, res) {
    try {
        const message = await new Message({
            message: req.body.message,
            chat: req.params.chatId,
            user: req.user.id
        }).save()
        res.status(201).json(message)
    } catch(e) { errHandle(res, e) }
}
module.exports.delete = async function(req, res) {
    const candidate = await Message.findOne({_id: req.params.id})
    if (candidate) {
        try {
            await Message.deleteOne({_id: req.params.id})
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