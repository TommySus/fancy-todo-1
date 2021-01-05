const { Todo } = require('../models')

module.exports = (req,res,next) => {
        Todo.findOne({where: {id: req.params.id}})
        .then(data => {
            if(data){
                if (data.UserId == req.loggedInUser.id){
                    next()
                } else {
                    res.status(401).json({message: 'you are not authorize with this todo'})
                }
            } else {
                res.status(404).json({message: 'todo not found'})
            }
        })
        .catch(error => {
            res.status(401).json({message: 'you are not authorize with this todo'})
        })
}