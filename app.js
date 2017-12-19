const express = require('express');

const app = express();

app.set('view engine', 'jade');

app.get('/', (req, res) => {
    res.render('index.jade');
});

app.get('/register', (req, res) => {
    res.render('register.jade');
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