const { Todo } = require('../models')

class ControllerTodo {

    static createTodo(req,res) {
        const obj = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            due_date: req.body.due_date,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        Todo.create(obj)
        .then( data => {
            res.status(201).json({
                title: data.title,
                description: data.description,
                status: data.status,
                due_date: data.due_date
            })
        })
        .catch(error => {
            res.status(400).json(error.errors[0].message)
        })
    }

    static listTodo(req,res){
        Todo.findAll()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(500).json({ message: 'internal server error' })
        })
    }

    static findTodoById(req,res){
        Todo.findOne({where: {id: req.params.id}})
        .then(data => {
            if (data){
                res.status(200).json({
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    due_date: data.due_date,
                    UserId: data.UserId
                })
            } else {
                res.status(404).json({ message: 'todo not found' })
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'internal server error' })
        })
    }

    static updateTodo(req,res){
        Todo.update({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            due_date: req.body.due_date
        },{where: {id: req.params.id}})
        .then(data => {
            if (!data){
                res.status(401).json({ message: 'todo not found' })
            } else {
                return Todo.findOne({where: {id: req.params.id}})
                .then(data2 => {
                    if (data2){ 
                        res.status(200).json({
                            title: data2.title,
                            description: data2.description,
                            status: data2.status,
                            due_date: data2.due_date,
                            UserId: data2.UserId
                        })
                    }else {
                        res.status(500).json({ message: 'internal server error' })
                    }
                })
            }
        })
        .catch(error => {
            res.status(400).json(error.message)
        })
    }

    static updateStatusTodo(req,res){
        Todo.update({
            status: req.body.status,
        },{where: {id: req.params.id}})
        .then(data => {
            return Todo.findOne({where: {id: req.params.id}})
            .then(data2 => {
                if (data2){
                    res.status(200).json({
                        title: data2.title,
                        description: data2.description,
                        status: data2.status,
                        due_date: data2.due_date,
                        UserId: data2.UserId
                    })
                }else {
                    res.status(404).json({message: 'todo not found'})
                }
            })
        })
        .catch(error => {
            res.status(500).json({message: 'internal server error'})
        })
    }

    static deleteTodo(req,res){
        Todo.destroy({where: {id: req.params.id}})
        .then( data => {
            if (data){
                res.status(200).json({message: 'todo success to delete'})
            } else {
                res.status(404).json({message: 'todo not found'})
            }
        })
        .catch( error => {
            res.status(500).json({message: 'internal server error'})
        })
    }
}

module.exports = ControllerTodo