const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const favicon = require('serve-favicon');
// data
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors())
app.use(bodyParser.urlencoded({
    extended: false
}))

// DB
const usersDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'loginRegister',
    password: 'mhc22Lde55s'
});
console.log('Users DB Connected');

// view engine & favicon
app.set('view engine', 'ejs');

// static file paths
app.use(express.static('static'));
app.use(favicon(path.join(__dirname, 'static/img', 'favicon.ico')));
const ext = '/static/';
const html = "/html/"
const index = html + 'index.html';
const about = html + 'about.html';
// auth file paths 
const login = '/html/auth/login.html';
const success = '/html/auth/success.html';
const register = '/html/auth/register.html';

// auth vars
var email;
var password;
var name;
var token;
var userToken
// routes
app.get('/', (req, res) => {
    if (userToken) {
        console.log('logged in')
    } else {
        console.log('token:', token)
    }
    res.render('index')
});
app.get('/about', (req, res) => {
    if (userToken) {
        res.render('about')
        console.log('logged in')
    } else {
        res.render('auth/logout');
        console.log('token:', token);
    }
})

app.get('/success', (req, res) => {
    res.render('auth/success');
})
// register
app.get('/register', (req, res) => {
    res.render('auth/register');
})
app.post('/register', (req, res) => {
    try {
        // TOKEN ASSIGNMENT
        token = jwt.sign({
            email: req.body.email,
            password: req.body.password
        }, req.body.password);
        // CHECK FOR EXISTING USER
        usersDB.query('SELECT * FROM users WHERE email="' + req.body.email + '"', (err, results) => {
            if (err) throw err
            if (results.length) {
                res.send('User with email ' + req.body.email + ' already exists');
                return;
            };
        });
        // INSERTS NEW USER
        const sql = 'INSERT INTO users (name, email, password, jwt) VALUES ("' + req.body.name + '","' + req.body.email + '","' + req.body.password + '","' + token + '")'
        usersDB.query(sql, (err) => {
            if (err) throw err;
            name = req.body.name;
            email = req.body.email
            password = req.body.password
            res.redirect('/');
            return;
        });
    } catch (error) {
        console.error(error)
    }
});
// login
app.get('/login', (req, res) => {
    res.render('auth/login');
});
var email;
var password;
app.post('/login', (req, res) => {
    try {
        const selectUsers = 'SELECT * FROM users WHERE email="' + req.body.email + '" AND password="' + req.body.password + '"';
        usersDB.query(selectUsers, (err, results) => {
            if (err) throw err;
            if (results.length) {
                email = req.body.email;
                password = req.body.password;
                userToken = results[0].jwt
                console.log('token: ' + results[0].jwt);
                res.render('auth/success')
                return
            } else {
                res.render('auth/invalid');
                return;
            }
        }); //end post route
    } catch (error) {
        console.error();
    }
});
// logout
app.get('/logout', (req, res) => {
    res.render('auth/logout');
    userToken = undefined;
    console.log('token:', token)
})

// server declaration
app.listen(port, function (err) {
    if (err) {
        throw err
    } else {
        console.log(`App Listening at http://localhost:${port}`)
    };
});