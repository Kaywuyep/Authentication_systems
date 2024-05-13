//importing modules
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');

// initializing app variable
const app = express();

const PORT = 3000

//convert data to json format
app.use(express.json());

//indicate static files folder
app.use(express.static('public'));

//indiczte url encoding
app.use(express.urlencoded({extended:false}));

// indicate ejs to handl views
app.set('view engine', 'ejs');

// render web pages
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/signup', (req, res) => {
    res.render('signup');
});
app.get('/dashboard', (req,res) => {
    res.render('dashboard');
});

//register new user
app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    // check if the username already exist
    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        res.send('User already exist');
    } else {
        //hash password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;
        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }
    const signUpSucessful = await collection.findOne({ name: req.body.username});
    if (signUpSucessful) {
        res.render('login');
    }
});

//login user
app.post('/login', async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send('Username cannot be found');
        }
        // compare the harshed password from the db
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send('Wrong password');
        } else {
            res.render('dashboard');
        }
    } catch {
        res.send('Wrong Details');
    }
});

// run server
app.listen(PORT, () => {
    console.log(`server running on localhost:${PORT}`);
});