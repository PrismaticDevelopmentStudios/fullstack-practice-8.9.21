const mysql = require('mysql2')
const usersDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'loginRegister',
    password: 'mhc22Lde55s'
  });
  console.log('Users DB Connected')

  module.exports = usersDB