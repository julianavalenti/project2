
// Dependencies
const bcrypt = require('bcrypt');
const express = require('express');
const userRouter = express.Router();
const User = require('../models/user.js');


//I 
userRouter.get('/', async (req, res) => {
    const foundUsers = await User.find({});
    res.render('index.ejs', {
      users: foundUsers
    });
  });
  
// New (registration page)
userRouter.get('/register', (req, res)=> {
    res.render('register.ejs')
})

//D

//U

// Create (registration route)
userRouter.post('/register', async (req, res) => {
    try {
      req.body.password = await bcrypt.hash(req.body.password, 10);
      const createdUser = await User.create(req.body);
      res.redirect("/users");
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating user');
    }
  });


  //E

  //S


// Export User Router
module.exports = userRouter;