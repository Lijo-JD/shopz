const mongoose = require("mongoose")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const jwt = require('jsonwebtoken');

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

mongoose.connect('mongodb://localhost:27017/shopz', { useNewUrlParser: true, useUnifiedTopology: true  })

mongoose.connection.on('open', () => {
  console.log('Connected to database')
})

const userSchema = mongoose.Schema({
  'email': {type: String, required: true},
  'password': {type: String, required: true},
  'security': {type: String, required: true}
})

const userModel = mongoose.model('users', userSchema)

app.get('/users', async(req, res) => {
  let users = await userModel.find().exec()
  res.json(users)
})

app.post('/register', async(req, res) => {
  let user = new userModel(req.body)
  let result = await user.save()
  res.json(result)
})

app.post('/login', async(req, res) => {
  let user = await userModel.findOne({ email: req.body.email}).exec()
  if(user === null){
    res.json("No such user")
  } else {
    let token = jwt.sign({security: user.security, email: user.email}, '123456789', {expiresIn: 120})
    res.json(token)
  }
})


app.listen(3000, ()=> {
  console.log("Server listening on port 3000")
})
