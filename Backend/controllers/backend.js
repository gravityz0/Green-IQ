const bcrypt  = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const Users = require('../models/register.model')
const { validationResult } = require('express-validator')
const sendEmail = require('@sendgrid/mail')
// const transporter = require('../config/emailVerify')
require('dotenv').config()


const signUp = async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({message: errors.array()})
    }else{
        const {email, fullNames, password} = req.body;

        try {
            const emailExist = await Users.findOne({ email })
            if(emailExist){
                res.status(409).json({message: 'Email already exist'})
            }else{
                const hashedPassword = await bcrypt.hash(password,10)
                const verificationToken = crypto.randomBytes(20).toString('hex')
                const newUser = await Users.create({
                    email,
                    fullNames,
                    password: hashedPassword,
                    verificationToken
                })

                const url = `http://10.12.75.75:4000/verify/${verificationToken}`

                sendEmail.setApiKey(process.env.SEND_GRID_API_KEY)
                const message ={
                    to: email,
                    from: 'rukundof993@gmail.com',
                    subject: 'Verify Your account',
                    html: `<a href=${url}>Verify Your account</a>`
                }
                sendEmail
                .send(message)
                .then(()=>{
                    console.log('Email sent')
                })
                .catch((error)=>{
                    console.log(error)
                })
                res.status(201).json({message: 'Sign Up successful please verify your account'})
            }
        } catch (error) {
            res.status(500).json({message: 'Internal server error'})
        }
    }
}


const verifyEmail = async(req,res)=>{
    const {verificationToken} = req.params
    try {
        const user = await Users.findOne({ verificationToken })
        if(!user){
            res.status(400).json({mesasage: 'Invalid credentials'})
        }else{
            user.isVerified = true
            user.verificationToken = undefined
            await user.save()
            res.status(200).json({message: 'Account verified successfully'})
        }
    } catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
}

const login = async(req,res) =>{
    const { email,password } = req.body
    try {
        const user = await Users.findOne({email})
        const verifyPassword = await bcrypt.compare(password,user.password)
    
        if(user && verifyPassword && user.isVerified){
            const token = jwt.sign({id: user._id, email: user.email, names: user.fullNames},process.env.JWT_KEY,{expiresIn: '1h'})
            res.cookie('Token',token,{httpOnly: true}).json({message: 'Logged in successfully'})
        }else{
            res.status(400).json({message: 'Invalid credentials'})
        }
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
}


const logout = (req,res)=>{
    res.clearCookie('token').json({message: 'Logged out successfully'})
}

module.exports = {
    signUp,
    verifyEmail,
    logout,
    login
}