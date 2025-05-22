const express = require('express')
const cors = require('cors')
const routes = require('./routes/routes')
const mongoose = require('mongoose')
const cookieParser  = require('cookie-parser')
const app = express()

app.use(express.json())

app.use(cors({
    origin: 'client url',
    credentials: true,
    methods: ['GET','POST','DELETE','PUT']
}))


app.use(cookieParser())
app.use('/',routes)


mongoose.connect('mongodb://localhost:27017/Trash2Treasure')
.then(()=>{
    console.log('Connection to db successfully')
})

.catch((error)=>{
    console.log('Connection to dd failed')
});

const port = 4000;

app.listen(port, '0.0.0.0',()=>{
    console.log(`Listening on port ${port}`);
})