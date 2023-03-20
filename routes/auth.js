const express = require('express')
const routes = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const J_W_T = 'muhammadmudasiirisgood$oy'
const fetchData = require('../middleware/fetchData')

// Route 1: create a new user using post--no login required
routes.post('/createuser', [body('name').isLength({ min: 3 }),
body('email').isEmail(),
body('password').isLength({ min: 5 })], async (req, res) => {
  let success =false
  // if there are errors return bad request and log errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    success = false
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // if email already exist return error 
    let user = await User.findOne({ email: req.body.email })
    if (user) { return res.status(400).json("use with this email already exist") }
    // create user in database
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
      pass: req.body.password
    })
    const data = {
      user: {
        id: user._id
      }
    }
    const authtoken = jwt.sign(data, J_W_T)
    success=true
    res.send({success, authtoken})
  } catch (error) {
    console.log(error)
    res.status(500).send('sone internal error occurred')
  }
})


// Route 2: login the existing user using post--no login required
routes.post('/login', [
  body('email', 'please enter vaild emial').isEmail(),
  body('password', 'password cannot be blanked').exists()], async (req, res) => {
    // if there are errors return bad request and log errors
    let success =false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({email});
      if (!user) {
        return res.status(400).json({ error: 'email or password are incorrect' })
      }
      let checkedPassword = await bcrypt.compare(password, user.password);
      if (!checkedPassword) {
        success=false
        return res.status(400).json({ error: 'email or password are incorrect' })
      }
      const data = {
        user: {
          id: user._id
        }
      }
      success= true
      const authtoken = jwt.sign(data, J_W_T)
      res.send( {success, authtoken})
    } catch (error) {
      console.log(error)
      res.status(500).send('sone internal error occurred')
    }
  })
// Route 3: get user data using post-- login required
routes.post('/getuser', fetchData, async (req, res) => {
    // if there are errors return bad request and log errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
       const userId = req.user.id;
       const user = await User.findById(userId).select('-password')
        res.send(user)
    } catch (error) {
      console.log(error)
      res.status(500).send('sone internal error occurred')
    }
  })
module.exports = routes