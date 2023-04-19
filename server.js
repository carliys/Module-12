const inquirer = require("inquirer");
const fs = require("fs");
const logo = require('asciiart-logo');

const mysql = require('mysql2');
require('dotenv').config();

var connection = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: 'Thegame1',
    database: 'employees_db'

});

 



