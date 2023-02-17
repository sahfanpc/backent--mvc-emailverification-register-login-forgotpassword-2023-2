const userModel = require("../models/models");
const bcrypt = require('bcrypt')
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const sendmail = require('../verification/email__verify')
const randomstring = require('randomstring')



// /////////////////
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
        const { fname, lname, email, phonecode, number, password } = req.body
        const user = await userModel.findOne({ email })
        if (user) {
            res.status(420).send({ status: true, message: "already registered" })
        } else {
            const salt = await bcrypt.genSalt(10);
            const securePassword = await bcrypt.hash(password, salt);
            const token = randomstring.generate()
            const newUser = new userModel({
                fname,
                lname,
                email,
                phonecode,
                number,
                password: securePassword,
                token
            })
            await newUser.save()
            const intro = "Welcome to DART SOCIETY,We're excited to have you on board"
            const link = `http://localhost:4200/otp1?token=${token}`
            const text = 'Confirm Your Email'
            const instruction = 'To confirm your email, please click here:'
            await sendmail.sendMail(intro, fname, email, instruction, text, link)
            res.status(212).send({ status: true, message: " register seccessfully", newUser })
        }
    }
    catch (error) {
        console.log(error.message)
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
                    jtoken: tokenData
                }
                res.status(212).send({ status: true, message: 'login seccessfully', data: userResult })
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

// update password
const update_password = async (req, res) => {
    try {

        const user_id = req.body.user_id
        const password = req.body.password
        const data = await userModel.findOne({ _id: user_id })
        if (data) {
            const salt = await bcrypt.genSalt(10);
            const value = await bcrypt.hash(password, salt);
            const newpassword = value;
            await userModel.findByIdAndUpdate({ _id: user_id }, {
                $set: {
                    password: newpassword
                }
            });
            res.status(200).send({ status: true, message: "updated" });
        } else {
            res.status(420).send({ status: false, message: "user id nt found!" });
        }
    } catch (error) {
        res.status(400).send({ status: false, message: "user id nt found!" });
    }
}


// forgot password
const forgot_password = async (req, res) => {

    try {

        const { email } = req.body
        const userData = await userModel.findOne({ email })
        if (userData) {
            // await userModel.findOneAndUpdate({ email }, { $set: { token: token } })
            const token = randomstring.generate()
            userData.token = token
            await userData.save()
            const intro = "Welcome to DART SOCIETY,this is regarding your reset password request"
            const name = userData.fname
            const link = `http://localhost:4200/reset?token=${token}`
            const text = 'Reset Your Password'
            const instruction = 'To reset your password, please click here:'
            await sendmail.sendMail(intro, name, email, instruction, text, link)
            res.status(200).send({ status: true, message: "check your inbox", data: userData })
        } else {
            res.status(400).send({ status: false, message: "user not found" })
        }
    } catch (error) {
        res.status(400).send({ status: false, message: error.message })
    }
}


// emial verifying

const user__verify = async (req, res) => {
    try {
        const token = req.query.token
        console.log(token);
        const user = await userModel.findOne({ token })
        if (user) {
            user.token = ''
            user.verified = true
            await user.save()
            res.status(210).json({ message: "User verified successfully" })

        } else {
            res.status(410).json({ message: "Token expired" })
        }
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}




const Reset_password = async (req, res) => {
    try {
        const token = req.query.token
        const userData = await userModel.findOne({ token });
        if (userData) {
            const password = req.body.password
            const salt = await bcrypt.genSalt(10);
            const newPassword = await bcrypt.hash(password, salt);
            await userModel.findOneAndUpdate({ token }, {
                $set: {
                    password: newPassword,
                    token: ''
                }
            });
            res.status(202).send({ status: true, message: "password has been reseted", data: userData })
        } else {
            res.status(400).send({ status: false, message: "link has been expared" })
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}
module.exports = { Register, Login, update_password, forgot_password, Reset_password, user__verify }


// randomstring install