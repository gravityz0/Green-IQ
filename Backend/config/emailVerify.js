const nodemailer  = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth:{
        user: 'apikey',
        pass: process.env.SEND_GRID_API_KEY
    }
})

module.exports =  transporter