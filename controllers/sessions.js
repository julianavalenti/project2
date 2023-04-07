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


//U
// Route for updating the password 
// foundUser.name = req.body.name
// it needs a statement that validates if the form entry a value or not
sessionsRouter.put('/edit', async (req, res) => {
    try {
        const foundUser = await User.findById(req.session.currentUser._id);
        const newPassword = await bcrypt.hash(req.body.newPassword, 10);
        foundUser.password = newPassword;
        
        await foundUser.save();
        await User.findByIdAndUpdate(
            req.params.id,
            req.body,
        {
            new:true
        }
        )
        res.redirect('/sessions/account');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating password');
    }
});


// Create (login route)
sessionsRouter.post('/login', async (req, res) => {
    try {
      const foundUser = await User.findOne({ email: req.body.email });
      if (!foundUser) {
        res.render('login.ejs', { 
            message: 'Email not found' 
        });
      } else {
        const passwordMatches = await bcrypt.compare(req.body.password, foundUser.password);
        if (passwordMatches) {
          req.session.currentUser = foundUser;
          res.redirect('/sessions/index');
        } else {
          res.render('login.ejs', {
             message: 'Invalid Password'
             });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error logging in user');
    }
  });

  //E

  sessionsRouter.get("/edit", async (req,res) => {
    const foundUser = await User.findById(
        req.params.id,
        );
    res.render("portal/edit.ejs", {
        user: foundUser,
    })
})

  
//S

sessionsRouter.get('/account', (req, res) => {
	
    res.render('portal/account.ejs', {
        
    });
}); 

module.exports = sessionsRouter;