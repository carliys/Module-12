const inquirer = require("inquirer");
const fs = require("fs");

const mysql = require('mysql2');
// require('dotenv').config();
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

// viewing the employees
/* const selectEmployees = () => {
    connection.query(`SELECT * FROM employee;`, 
    (err, results) => {
        mainMenu();
    });
} */

const selectEmployees = () => {
    connection.query(
        "SELECT Employees.id, Employees.first_name, Employees.last_name, Roles.title, Departments.name AS Departments, Roles.salary, CONCAT(Manager.first_name,' ',Manager.last_name) AS Manager FROM Employees LEFT JOIN Roles ON Employees.role_id = Roles.id LEFT JOIN Departments ON Roles.department_id = Departments.id LEFT JOIN Employees Manager ON Employees.manager_id = Manager.id;",
        (err, results) => {
            console.table(results);
            mainMenu();
        }
    )
};

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
                connection.promise().query("INSERT INTO departments SET ?", name);
                selectDepartments();
            })
        }

        const promptAddRole = () => {

            return connection.promise().query(
                "SELECT departments.id, departments.name FROM departments;"
            )
                .then(([departments]) => {
                    let departmentChoices = departments.map(({
                        id,
                        name
                    }) => ({
                        name: name,
                        value: id
                    }));
        
                    inquirer.prompt(
                        [{
                            type: 'input',
                            name: 'title',
                            message: 'Enter the name of your title (Required)',
                            validate: titleName => {
                                if (titleName) {
                                    return true;
                                } else {
                                    console.log('Please enter your title name!');
                                    return false;
                                }
                            }
                        },
                        {
                            type: 'list',
                            name: 'department',
                            message: 'Which department are you from?',
                            choices: departmentChoices
                        },
                        {
                            type: 'input',
                            name: 'salary',
                            message: 'Enter your salary (Required)',
                            validate: salary => {
                                if (salary) {
                                    return true;
                                } else {
                                    console.log('Please enter your salary!');
                                    return false;
                                }
                            }
                        }
                        ]
                    )
                        .then(({ title, department, salary }) => {
                            const query = connection.query(
                                'INSERT INTO Roles SET ?',
                                {
                                    title: title,
                                    department_id: department,
                                    salary: salary
                                },
                                function (err, res) {
                                    if (err) throw err;
                                }
                            )
                        }).then(() => selectRoles())
        
                    })
                 }

const promptAddEmployee = (roles) => {
    return connection.promise().query(
        "SELECT Roles.id, roles.title FROM Roles;"
    )
    .then (([employees]) => {
        let titleChoices = employees.map(({
            id,
            title
        }) => ({
            value: id,
            name: title
        }))
        connection.promise().query(
         "SELECT Employees.id, CONCAT(Employees.first_name,'',Employees.last_name) AS manager FROM Employees;"
        ).then(([manager]) => {
            let managerChoices = manager.map(({
                id,
                manager
            }) => ({
                value: id,
                name: manager
            }));
            inquirer.prompt(
                [{
                    type: 'input',
                    name: 'firstName',
                    message: 'What is employees first name?',
                    validate: firstName => {
                        if (firstName) {
                            return true;
                        } else {
                            console.log("enter employees first name please!")
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'What is employees last name?',
                    validate: lastName => {
                        if (lastName) {
                            return true;
                        } else {
                            console.log('enter employees last name please!');
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'what is employees role?',
                    choices: titleChoices
                },
                {
                    type: 'list',
                    name: 'manager',
                    messages: 'who is the employees manager?',
                    choices: managerChoices
                }
            ])
            .then(({firstName, lastName, roles, managers}) => {
                const query = connection.query(
                    'INSERT INTO Employees SET;',
                    {
                        first_name: firstName,
                        Last_name: lastName,
                        role_id: roles,
                        manager_id: managers
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log({ roles, manager})
                    }
                )
            })
            .then (() => selectEmployees())
        })
    })
}
 const promptUpdateRole = () => {
    return connection.promise().query(
        "SELECT Roles.id, Roles.title, Roles.salary, Roles.department_id FROM Roles;"
    )
    .then(([roles]) => {
        let roleChoices = roles.map((
            {
                id,
                title

            }) => ({
                value: id,
                name: title
            }));

            inquirer.prompt(
                [
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Which role do you want to update?',
                        choices: roleChoices
                    }
                ]
            )
                .then(role => {
                    console.log(role);
                    inquirer.prompt(
                        [{
                            type: 'input',
                            name: 'title',
                            message: 'Enter the name of your title (Required)',
                            validate: titleName => {
                                if (titleName) {
                                    return true;
                                } else {
                                    console.log('Please enter your title name!');
                                    return false;
                                }
                            }
                        },
                        {
                            type: 'input',
                            name: 'salary',
                            message: 'Enter your salary (Required)',
                            validate: salary => {
                                if (salary) {
                                    return true;
                                } else {
                                    console.log('Please enter your salary!');
                                    return false;
                                }
                            }
                        }]
                    )
                        .then(({ title, salary }) => {
                            const query = connection.query(
                                'UPDATE roles SET title = ?, salary = ? WHERE id = ?',
                                [
                                    title,
                                    salary
                                    ,
                                    role.roles
                                ],
                                function (err, res) {
                                    if (err) throw err;
                                }
                            )
                        })
                        .then(() => mainMenu())
                })
        });

}; 
mainMenu();


 



