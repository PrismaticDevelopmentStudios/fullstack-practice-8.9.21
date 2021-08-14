const bodyParser = require('body-parser');
const cors = require('cors');

import app from '../../index.js';
import usersDB from './db.js';
app.use(cors());
app.use(bodyParser.json);
app.use(bodyParser.urlencoded({
    extended: false
 }));

var email;
var password;
app.post('/login', (req, res) => {
    const selectUsers = 'SELECT * FROM users WHERE email="' + req.body.data.email + '" AND password="' + req.body.data.password + '"';
    usersDB.query(selectUsers, (err, results) => {
        if (err) throw err;
        if (results.length) {
            res.send('Successful login');
            email = req.body.email;
            password = req.body.password;
            console.log(req.body);
        } else {
            res.send('Invalid Credentials')
        }
        res.send('login route')
    });
});