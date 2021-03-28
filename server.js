const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'supersimple',
    database: 'employee_db',

});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    connection.end();

});

// Create a function for the initial prompt and choices
const initialQuestions = () =>
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'initPrompt',
                message: 'Choose one of the following actions:',
                choices: ['View All Employees', 'View All Employees by Department', 'View All Employees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager'],
            },

        ])
        .then((answer) => {
            switch (answer.initPrompt) {
                case 'View All Employees':
                    console.log('View All Employees was selected');
                    break;
                case 'View All Employees by Department':
                    console.log('View All Employees by Department was selected');
                    break;
                default:
                    console.log("No Cases matched");
                    break;
            }
        })
    ;

initialQuestions();