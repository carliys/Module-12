const inquirer = require("inquirer");
const fs = require("fs");

const mysql = require('mysql2');
require('dotenv').config();
require('console.table');

var connection = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: 'Thegame1',
    database: 'employees_db'

},
    console.log('Connected to employees_db Database!')
);

const mainMenu = () => {
    return inquirer.prompt([{

        name: 'main_menu',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'view all departments',
            'view all roles',
            'view all employees',
            'add a department',
            'add a role',
            'add an employee',
            'update an employee role',
            'exit'
        ]
    }])
    .then(userChoice => {
        switch (userChoice.main_menu) {
            case 'view all departments':
                selectDepartments();
                    break;
                case 'view all roles':
                    selectRoles();
                    break;
                case 'view all employees':
                    selectEmployees();
                    break;
                case 'add a department':
                    promptAddDepartment();
                    break;
                case 'add a role':
                    promptAddRole();
                    break;
                case 'add an employee':
                    promptAddEmployee();
                    break;
                case 'update an employee role':
                    promptUpdateRole();
                    break;
                default:
                    process.exit();
        }
    });
};

const selectDepartments = () => {
    connection.query(
        'select * from departments;',
        (error, results) => {
            console.table(results);
            mainMenu();

        }
    );
};

const selectRoles = () => {
    connection.query(
        'select * from roles;',
        (error, results) => {
            console.table(results);
            mainMenu();
        }
    )
};

const selectEmployees = () => {
    connection.query(`SELECT * FROM employee;`, 
    (err, results) => {
        mainMenu();
    });
}

const promptAddDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the department you'd like to add?",
            validate: departmentName => {
                if (departmentName) {
                    return true;
                } else {
                    console.log('Please enter the name of your department!');
                    return false;
                }
            }
        }
        ])
            .then(name => {
                connection.promise().query("INSERT INTO department SET ?", name);
                selectDepartments();
            })
        }


    

mainMenu();


 



