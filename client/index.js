const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const mysql = require('mysql2')
const http = require('http')
// data
const bodyParser = require('body-parser');
const cors = require('cors');
const { nextTick } = require('process');
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))

// DB
const usersDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'loginRegister',
    password: 'mhc22Lde55s'
  });
  console.log('Users DB Connected')

// static file paths
app.use(express.static('static')) 
const ext = '/static/';
const html = "/html/"
const index =  html + 'index.html';
const about = html + 'about.html';
// auth routes 
const login = '/html/auth/login.html';

// routes
app.get('/', (req,res) => {
   res.sendFile(path.join(__dirname, ext, index));
});
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, ext, about))
})
app.get('/login', (req,res) => {
    res.sendFile(path.join(__dirname, ext, login));
 });
 var email;
var password;
app.post('/login', (req, res) => {
    try {
        const selectUsers = 'SELECT * FROM users WHERE email="' + req.body.email + '" AND password="' + req.body.password + '"';
        usersDB.query(selectUsers, (err, results) => {
           if (err) throw err;
           if (results.length) {
               res.send('Success');
               email = req.body.email;
               password = req.body.password;
               console.log(req.body);
               return
           } else {
               res.send('Invalid Credentials')
               return
           }
           res.send('login route')
       }); //end post route
    } catch (error) {
     console.error();   
    }
});

// server declaration
app.listen(port, function(err) {
    if (err) {throw err}
    else {console.log(`App Listening at http://localhost:${port}`)};
});
