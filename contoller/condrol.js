const userModel = require("../models/models");
// npm i bcrypt
const bcrypt = require('bcrypt')
//
// token
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const create_token = async (id) => {
    try {

        const token = await jwt.sign({ _id: id }, config.secret_jwt);
        return token;
    } catch (error) {
        res.status(400).send(error.message);
    }
}
// 
const Register = async (req, res) => {
    try {
        console.log(req.body);
        const user = await userModel.findOne({ email: req.body.email })
        // encription.....................
        var value1 = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const value = await bcrypt.hash(value1, salt);
        console.log(value)
        // npm i jsonwebtoken
        if (user) {
            res.status(420).send({ status: true, message: "already registered" })
        } else {
            const newUser = new userModel({
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                phonecode: req.body.phonecode,
                number: req.body.number,
                password: value,
                conformpassword: req.body.conformpassword,

            })
            console.log("hello")
            await newUser.save()
            res.status(212).send({ status: true, message: " registered seccessfully", newUser })
        }
    }
    catch {
        console.log("Something went wrong");
    }

}
// login with encription
const Login = async (req, res) => {
    try {
        const userData = await userModel.findOne({ email: req.body.email })
        password = req.body.password;
        if (userData) {
            const passwordmatch = await bcrypt.compare(password, userData.password)
            console.log(passwordmatch);
            if (passwordmatch) {
                //token 
                const tokenData = await create_token(userData._id);

                const userResult = {
                    _id: userData._id,
                    fname: userData.fname,
                    lname: userData.lname,
                    email: userData.email,
                    phonecode: userData.phonecode,
                    number: userData.number,
                    password: userData.password,
                    token: tokenData
                }
                const response = {
                    success: true,
                    msg: 'user Details',
                    data: userResult
                }
                res.status(212).send(response)
                // 
            } else {
                res.status(420).send({ status: false, message: "log in fail" })
            }
        } else {
            res.status(420).send({ status: false, message: "email not found" })
        }
    } catch (error) {
        console.error(error)
    }
}
module.exports = { Register, Login }