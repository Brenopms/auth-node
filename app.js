'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('client-sessions');

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

app.get('/', (req, res) => {
    res.render('index.jade');
});

app.get('/register', (req, res) => {
    res.render('register.jade');
});

//POST Route
app.post('/register', (req,res) => {
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
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
            if(req.body.password === user.password){
                req.session.user = user;
                res.redirect('/dashboard');
            } else {
                res.render('login.jade', {error: 'incorrect email/password'});
            }
        }
    });
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard.jade');
});

app.listen(3000, () => {
    console.log('app is running on the 3000 port')
});