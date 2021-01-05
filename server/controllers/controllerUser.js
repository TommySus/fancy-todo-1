const { User } = require('../models')
const { compare } = require('../helper/bcrypt')
const { generateToken } = require('../helper/jwt')


class ControllerUser {

    static register(req,res){
        const obj = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password
        }
        User.create(obj)
        .then(data => {
            console.log('masuk register')
            res.status(201).json({
                id: data.id,
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email
            })
        })
        .catch(error => {
            console.log(error)
            console.log('masuk error register')
            res.status(500).json({ message: "internal server error" })
        })
    }

    static login(req,res){
        User.findOne({where: {email: req.body.email}})
        .then(data => {
            if (data){
                if(compare(req.body.password,data.password)){
                    const access_token = generateToken({id: data.id, email:data.email})
                    res.status(200).json({ access_token })
                } else {
                    res.status(404).json({ message: "wrong email/password" })
                } 
            } else {
                res.status(404).json({ message: "wrong email/password" })
            }
        })
        .catch(error => {
            res.status(500).json({ message: "internal server error" })
        })
    }
}

module.exports = ControllerUser