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

const productSchema = mongoose.Schema({
  'item_name': {type: String, required: true},
  'item_price': {type: String, required: true}
})

const productModel = mongoose.model('products', productSchema)

app.get('/users', async(req, res) => {
  let users = await userModel.find().exec()
  res.json(users)
})

app.post('/register', async(req, res) => {
  userModel.find({email: req.body.email}, async(err, docs) => {
    if(docs.length) {
      res.send(null)
    } else {
      let user = new userModel(req.body)
      let result = await user.save()
      res.json(result)
    }
  })
})

app.post('/login', async(req, res) => {
  let user = await userModel.findOne({ email: req.body.email, password: req.body.password}).exec()
  if(user === null){
    res.send(null)
  } else {
    let token = jwt.sign({security: user.security, email: user.email}, '123456789', {expiresIn: 120})
    res.json(token)
  }
})

app.get('/products', async(req, res) => {
  let products = await productModel.find().exec()
  res.json(products)
})

function validateToken(req, res, next) {
  let token = req.headers['authorization']
  token = JSON.parse(token)
  if (token) {
      try {
          let payload = jwt.verify(token, '123456789')
          if(payload.security === 'admin') {
            next()
          } else {
            res.send("Unauthorised access")
          }
      } catch (e) {
          console.log(e)
          return res.status(401).end()
      }

  } else {
      res.send("no token")
  }
}

app.post('/add', validateToken, async(req, res) => {
  let product = new productModel(req.body)
  let result = await product.save()
  res.json(result)
})

app.put('/edit', validateToken, async(req, res) => {
  let product = await productModel.findById(req.body._id).exec()
  product.set(req.body)
  let result = await product.save()
  res.json(result)
})

app.delete('/delete/:id', validateToken, async(req, res) => {
  let result = await productModel.findByIdAndDelete(req.params.id).exec()
  res.json(result)
})

app.delete('/deleteUser/:id', validateToken, async(req, res) => {
  let result = await userModel.findByIdAndDelete(req.params.id).exec()
  res.json(result)
})



app.listen(3000, ()=> {
  console.log("Server listening on port 3000")
})
