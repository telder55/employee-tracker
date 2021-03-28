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
        .then(() => {
            console.log("Reached this location");

        }

        )
    ;

initialQuestions();