'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('client-sessions');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/svcc');


const app = express();
app.use(bodyParser.urlencoded({ extended:true}));

app.use(session({
    cookieName: 'session',
    secret: 'some_random_string',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60* 1000 //optional
}));


//User model
const Schema = mongoose.Schema;
let objectId = Schema.objectId;

let User = mongoose.model('User', new Schema ({
    // id: objectId,
    firstName: String,
    lastName: String,
    email: {type: String, unique: true},
    password: String,
},{usePushEach: true}));


app.set('view engine', 'jade');

//Smart user middleware

app.use((req,res, next) => {
    if(req.session && req.session.user) {
        models.User.findOne({email: req.session.user.email}, (err, user) =>{
            //if a user was found, make the user avaliable
            if(user) {
                req.user = user;
                delete req.user.password; //don't make the password hash avaliable
                req.session.user = user; //update the session info
                res.locals.user = user; //make the user avaliable to templates
            }
            next();
        });
    } else {
        next(); //if no session is avaliable, do nothing
    }
});

function requireLogin(req, res, next) {
    //if this user isn't logged in, redirect them to the login page
    if(!req.user){
        res.redirect('/login');
        //if the user is logged in, let them pass
    } else {
        next();
    }
};


app.get('/', (req, res) => {
    res.render('index.jade');
});

app.get('/register', (req, res) => {
    res.render('register.jade');
});

//POST Route
app.post('/register', (req,res) => {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.password, salt);

    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
    });

    user.save(function(err){
        if(err){
            let error = 'Something bad happened! Please try again';

            if(error.code === 11000){
                error = 'That email is alredy taken, please try another';
            }

            res.render('register.jade', {error: error});
        } else {
            res.redirect('/dashboard');
        }
    });
});

app.get('/login', (req, res) => {
    res.render('login.jade');
});

app.post('/login', (req,res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(!user){
            res.render('login.jade', {error: 'Incorrect email/password'});
        } else {
            if(bcrypt.compareSync(req.body.password, user.password)) {
                req.session.user = user;
                res.redirect('/dashboard');
            } else {
                res.render('login.jade', {error: 'incorrect email/password'});
            }
        }
    });
});

app.get('/dashboard', requireLogin, (req, res) => {
    if(req.session && req.session.user){
        User.findOne({email: req.session.user.email}, (err, user) => {
            if(!user){
                req.session.reset();
                res.redirect('/login');
            } else {
                res.locals.user = user;
                res.render('dashboard.jade');
            }
        });
    } else {
        res.redirect('/login');
    }
});

app.listen(3000, () => {
    console.log('app is running on the 3000 port')
});