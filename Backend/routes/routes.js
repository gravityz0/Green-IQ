const express = require('express')
const { signUp,login,logout,verifyEmail } = require('../controllers/backend')
const { body }  = require('express-validator')

const router = express.Router()

router.post('/signup',[
    body('fullNames').notEmpty().withMessage('Please Enter Fullnames'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({min: 8}).withMessage('Password must have atleast 8 characters')

],signUp)

router.post('/login',login)
router.get('/verify/:verification',verifyEmail)
router.get('/logout',logout)

module.exports = router