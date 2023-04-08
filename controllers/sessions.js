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

sessionsRouter.put('/edit', async (req, res) => {
    try {
        const foundUser = await User.findById(req.session.currentUser._id);

        foundUser.name = req.body.name;
        foundUser.email = req.body.email;
        foundUser.phone = req.body.phone;

        await foundUser.save();
        req.session.currentUser = foundUser
        res.redirect('/sessions/index');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating personal information');
    }
});

sessionsRouter.put('/password', async (req, res) => {
    try {
        const foundUser = await User.findById(req.session.currentUser._id);

        
        if (req.body.newPassword) {
            const newPassword = await bcrypt.hash(req.body.newPassword, 10);
            foundUser.password = newPassword;
            await foundUser.save();
            res.redirect('/sessions/account');
        } else {
            
            res.status(400).send('New password is required');
        }

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