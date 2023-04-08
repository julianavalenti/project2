
// Dependencies
require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const userController = require('./controllers/users');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const PORT = process.env.PORT;
const MongoStore = require('connect-mongo');

// Middleware
// Body parser middleware: give us access to req.body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Routes / Controllers



app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        keepSessionInfo: true,
         store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL ,
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native' 
        })
    }));

   

    app.use((req,res,next) => {
        res.locals.currentUser = req.session.currentUser
        next()
    }) 

    
    // the function above creates the variable called "currentUser", so I can use in all templates after user login.

// Routes / Controllers
const sessionsController = require('./controllers/sessions');
app.use('/sessions', sessionsController);

app.use('/users', userController);

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
app.get('/', (req,res,next) => {
    req.session.user = {
        uuid: '12234-2345-2323423'
    }
    req.session.save(err => {
        if(err){
            console.log(err);
        } else {
            res.send(req.session.user)
        }
    });
})

app.get('/users/about', (req, res) => {
    res.render('show.ejs');
});




app.listen (PORT, () => {
    console.log(`listening on ${PORT}`)
})