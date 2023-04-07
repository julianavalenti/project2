
// Dependencies
require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const userController = require('./controllers/users');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const PORT = process.env.PORT;

// Middleware
// Body parser middleware: give us access to req.body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Routes / Controllers

app.use('/users', userController);

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        keepSessionInfo: true
    }));

    app.use((req,res,next) => {
        res.locals.currentUser = req.session.currentUser
        next()
    }) 

    // the function above creates the variable called "currentUser", so I can use in all templates after user login.

// Routes / Controllers
const sessionsController = require('./controllers/sessions');
app.use('/sessions', sessionsController);


// Database Configuration
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});



// Database Connection Error / Success
const db = mongoose.connection;
db.on('error', (err) => console.log(err.message + ' is mongod not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// app.get('/', (req, res) => {
//     res.render('index.ejs');
// });

app.get('/users/about', (req, res) => {
    res.render('show.ejs');
});




app.listen (PORT, () => {
    console.log(`listening on ${PORT}`)
})