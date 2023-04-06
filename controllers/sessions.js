const express = require('express');
const bcrypt = require('bcrypt');
const sessionsRouter = express.Router();
const User = require('../models/user.js');



//I


sessionsRouter.get('/login', (req, res)=> {
    res.render('login.ejs')
})

sessionsRouter.get('/index', (req, res)=> {
    res.render('portal/index.ejs')
})

//D

// Routes / Controllers
sessionsRouter.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            res.send(error);
        } else {
            res.render('index.ejs');
        }
    });
});

// Create (login route)
sessionsRouter.post('/login', async (req, res) => {
    try {
      const foundUser = await User.findOne({ email: req.body.email });
      if (!foundUser) {
        res.send(`Oops! No user with that email address has been registered.`);
      } else {
        const passwordMatches = await bcrypt.compare(req.body.password, foundUser.password);
        if (passwordMatches) {
          req.session.currentUser = foundUser;
          res.redirect('/sessions/index');
        } else {
          res.send('Oops! Invalid credentials.');
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error logging in user');
    }
  });


module.exports = sessionsRouter;