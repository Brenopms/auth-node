'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/svcc');

app.use(bodyParser, urlencoded({ extended:True}))

const app = express();

//User model
const Schema = mongoose.Schema;



app.set('view engine', 'jade');

app.get('/', (req, res) => {
    res.render('index.jade');
});

app.get('/register', (req, res) => {
    res.render('register.jade');
});

//POST Route
app.post('/register', (req,res) => {
    res.json(req.body);
});

app.get('/login', (req, res) => {
    res.render('login.jade');
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard.jade');
});

app.listen(3000, () => {
    console.log('app is running on the 3000 port')
});