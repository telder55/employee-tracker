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
    // connection.end();

});

// Create a function for the initial prompt and choices
const initialQuestions = () =>
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'initPrompt',
                message: 'Choose one of the following actions:',
                choices: ['View All Employees', 'View All Employees by Department', 'View All Employees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'Exit'],
            },

        ])
        .then((answer) => {
            switch (answer.initPrompt) {
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'View All Employees by Department':
                    viewByDeptPrompt();
                    break;
                case 'View All Employees by Manager':
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Remove Employee':
                    getEmployeesArray();                    
                    break;
                case 'Update Employee Role':
                    break;
                case 'Update Employee Manager':
                    break;
                default:
                    console.log("No Cases matched");
                    connection.end();
                    break;
            }
        })
    ;

initialQuestions();

// Function for adding a new employee
const addEmployee = () =>
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "Enter employee's first name",
            },
            {
                type: 'input',
                name: 'lastName',
                message: "Enter employee's last name",
            },
            {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: ['Salesperson', 'Sales Lead', 'Software Engineer', 'Lead Engineer', 'Accountant', 'Lawyer', 'Legal Team Lead'],
            },

        ])
        .then((answer) => {
            console.log(answer);
            switch (answer.role) {
                case 'Salesperson':
                    // Passing First and Last name, and role ID 1, manager ID 2
                    createEmployee(answer.firstName, answer.lastName, 1, null)
                    break;
                case 'Sales Lead':
                    createEmployee(answer.firstName, answer.lastName, 2, 1)
                    break;
                case 'Software Engineer':
                    createEmployee(answer.firstName, answer.lastName, 3, null)
                    break;
                case 'Lead Engineer':
                    createEmployee(answer.firstName, answer.lastName, 4, 2)
                    break;
                case 'Accountant':
                    createEmployee(answer.firstName, answer.lastName, 5, null)
                    break;
                case 'Lawyer':
                    createEmployee(answer.firstName, answer.lastName, 6, null)
                    break;
                case 'Legal Team Lead':
                    createEmployee(answer.firstName, answer.lastName, 7, 3)
                    break;
                default:
                    break;
            }
        })
    ;

const createEmployee = (first, last, roleID, managerID) => {

    const newQuery = `INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ("${first}", "${last}", ${roleID}, ${managerID});`

    connection.query(newQuery , function (error, results, fields) {
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
    });
    initialQuestions();
}


// Need to fill in choices with list of employees from database! Choices is an array, how can I get an array in there?
const getEmployeesArray = () => {
    connection.query("SELECT first_name, last_name FROM employee_db.Employee;" , function (error, results, fields) {
        const resultsString = JSON.stringify(results);
        const resultsArray = JSON.parse(resultsString)
        const employeesArray = []
        for (let i = 0; i < resultsArray.length; i++) {
            const element = resultsArray[i].first_name + " " + resultsArray[i].last_name;
            newArray.push(element);
            
        }
        removeEmployeePrompt(employeesArray);
    });

}

const removeEmployeePrompt = (results) => { 
    
    inquirer
        .prompt([ 
            {
                type: 'list',
                name: 'role',
                message: "Which employee would you like to remove?",
                choices: results,
            },

        ])
        .then((answer) => {
            console.log(answer);
            switch (answer.role) {
                case 'Salesperson':
                    // Passing First and Last name, and role ID 1, manager ID 2
                    createEmployee(answer.firstName, answer.lastName, 1, null)
                    break;
                case 'Sales Lead':
                    createEmployee(answer.firstName, answer.lastName, 2, 1)
                    break;
                case 'Software Engineer':
                    createEmployee(answer.firstName, answer.lastName, 3, null)
                    break;
                case 'Lead Engineer':
                    createEmployee(answer.firstName, answer.lastName, 4, 2)
                    break;
                case 'Accountant':
                    createEmployee(answer.firstName, answer.lastName, 5, null)
                    break;
                case 'Lawyer':
                    createEmployee(answer.firstName, answer.lastName, 6, null)
                    break;
                case 'Legal Team Lead':
                    createEmployee(answer.firstName, answer.lastName, 7, 3)
                    break;
                default:
                    break;
            }
        })
    ;

}
    


const updateRole = () => {

}


const viewEmployees = () => {
    connection.query("SELECT * FROM employee_db.Employee;" , function (error, results, fields) {
        console.table(results);
        initialQuestions();
    });

}

const viewByDeptPrompt = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'deptPrompt',
                message: 'Which department would you like to view?',
                choices: ['Accounting', 'Engineering', 'Finance', 'Legal', 'Sales'],
            },

        ])
        .then((answer) => {
            switch (answer.deptPrompt) {
                case 'Accounting':

                    break;
                case 'Engineering':
                    break;
                case 'Finance':
                    break;
                case 'Legal':
                    break;
                case 'Sales':
                    break;
                default:
                    connection.end();
                    break;
            }
        })
    ;


}

const viewByDept = () => {
    connection.query("SELECT * FROM employee_db.Department;" , function (error, results, fields) {
        console.table(results);
        initialQuestions();
    });

}