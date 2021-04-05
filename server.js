const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "supersimple",
  database: "employee_db",
  multipleStatements: true,
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
        type: "list",
        name: "initPrompt",
        message: "Choose one of the following actions:",
        choices: [
          "View All Employees",
          "View All Employees by Department",
          "View All Employees by Manager",
          "Add Employee",
          "Add Department",
          "Add Role",
          "Remove Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.initPrompt) {
        case "View All Employees":
          viewEmployees();
          break;
        case "View All Employees by Department":
          getDept();
          break;
        case "View All Employees by Manager":
          break;
        case "Add Employee":
          getEmployeesArrayAdd();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          getDepartmentsArray();
          break;
        case "Remove Employee":
          getEmployeesArrayRemove();
          break;
        case "Update Employee Role":
          break;
        case "Update Employee Manager":
          break;
        default:
          console.log("Goodbye!");
          connection.end();
          break;
      }
    });
initialQuestions();

// Function for adding a new employee
const addEmployee = (employeeResults, roleResults) => {
  const employeesArrayAdd = [{ name: "No Manager", value: null }];
  for (let i = 0; i < employeeResults.length; i++) {
    const employeeObject = {};
    const element =
      employeeResults[i].first_name + " " + employeeResults[i].last_name;
    employeeObject.name = element;
    employeeObject.value = employeeResults[i].id;
    employeesArrayAdd.push(employeeObject);
  }
  const roleArrayAdd = [];
  for (let i = 0; i < roleResults.length; i++) {
    const roleObject = {};
    const element = roleResults[i].title;
    roleObject.name = element;
    roleObject.value = roleResults[i].id;
    roleArrayAdd.push(roleObject);
  }

  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter employee's first name",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter employee's last name",
      },
      {
        type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: roleArrayAdd,
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: employeesArrayAdd,
      },
    ])
    .then((answer) => {
      createEmployee(
        answer.firstName,
        answer.lastName,
        answer.role,
        answer.manager
      );
    });
};
const createEmployee = (first, last, roleID, managerID) => {
  const newQuery = `INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ("${first}", "${last}", ${roleID}, ${managerID});`;

  connection.query(newQuery, function (error, results, fields) {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
  });
  initialQuestions();
};

// Function for adding a new department
const addDepartment = () =>
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "Enter the Department Name",
      },
    ])
    .then((answer) => {
      createDepartment(answer.department);
    });
const createDepartment = (department) => {
  const newDept = `INSERT INTO Department (name) VALUES ("${department}");`;
  connection.query(newDept, function (error, results, fields) {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
  });
  initialQuestions();
};

// Function for adding a new role
const addRole = (results) => {
  const deptArray = [];
  for (let i = 0; i < results.length; i++) {
    const deptObject = {};
    const deptName = results[i].name;
    deptObject.name = deptName;
    deptObject.value = results[i].id;
    deptArray.push(deptObject);
  }
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the Job Title for this role",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the Salary for this role",
      },
      {
        type: "list",
        name: "department",
        message: "Choose a department for this role",
        choices: deptArray,
      },
    ])
    .then((answer) => {
      createRole(answer.title, answer.salary, answer.department);
    });
};

const createRole = (title, salary, department) => {
  const newRole = `INSERT INTO Role (title, salary, department_id ) VALUES ("${title}",${salary},${department});`;
  connection.query(newRole, function (error, results, fields) {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
  });
  initialQuestions();
};

// Gets an array of employees in database then calls remove employees
const getEmployeesArrayRemove = () => {
  connection.query(
    "SELECT first_name, last_name, id FROM employee_db.Employee;",
    function (error, results, fields) {
      const resultsString = JSON.stringify(results);
      const resultsArray = JSON.parse(resultsString);
      removeEmployeePrompt(resultsArray);
    }
  );
};

// Gets an array of employees in database then calls Add Employees
const getEmployeesArrayAdd = () => {
  connection.query(
    "SELECT first_name, last_name, id FROM employee_db.Employee; SELECT title, id FROM employee_db.Role",
    function (error, results, fields) {
      const resultsString = JSON.stringify(results);
      const resultsArray = JSON.parse(resultsString);
      addEmployee(resultsArray[0], resultsArray[1]);
    }
  );
};

// Gets an array of department names and ID's and passes to addRole function.
const getDepartmentsArray = () => {
  connection.query(
    "SELECT name, id FROM employee_db.Department;",
    function (error, results, fields) {
      const resultsString = JSON.stringify(results);
      const resultsArray = JSON.parse(resultsString);
      addRole(resultsArray);
    }
  );
};

const removeEmployeePrompt = (results) => {
  const employeesArrayRemove = [];
  for (let i = 0; i < results.length; i++) {
    const employeeObject = {};
    const element = results[i].first_name + " " + results[i].last_name;
    employeeObject.name = element;
    employeeObject.value = results[i].id;
    employeesArrayRemove.push(employeeObject);
  }

  inquirer
    .prompt([
      {
        type: "list",
        name: "remove",
        message: "Which employee would you like to remove?",
        choices: employeesArrayRemove,
      },
    ])
    .then((answer) => {
      console.log("Removed ", answer);

      const deleteQuery = `DELETE FROM employee_db.Employee WHERE (id = '${answer.remove}');`;
      connection.query(deleteQuery, function (error, results, fields) {});
      initialQuestions();
    });
};

const updateRole = () => {};

const viewEmployees = () => {
  connection.query(
    "SELECT * FROM employee_db.Employee;",
    function (error, results, fields) {
      console.table(results);
      initialQuestions();
    }
  );
};

const getDept = () => {
  connection.query(
    "SELECT name, id FROM employee_db.Department;",
    function (error, results, fields) {
      const resultsString = JSON.stringify(results);
      const resultsArray = JSON.parse(resultsString);
      viewByDeptPrompt(resultsArray);
    }
  );
};

const viewByDeptPrompt = (results) => {
  const deptArray2 = [];
  for (let i = 0; i < results.length; i++) {
    const deptObject2 = {};
    const deptName2 = results[i].name;
    deptObject2.name = deptName2;
    deptObject2.value = results[i].id;
    deptArray2.push(deptObject2);
  }
  inquirer
    .prompt([
      {
        type: "list",
        name: "deptPrompt",
        message: "Which department would you like to view?",
        choices: deptArray2,
      },
    ])
    .then((answer) => {
      const deptQuery = `SELECT Employee.first_name, Employee.last_name, Role.title FROM Employee INNER JOIN Role ON Employee.role_id = Role.id WHERE role_id=${answer.deptPrompt};`;
      connection.query(deptQuery, function (error, results, fields) {
        console.table(" ", results);
        initialQuestions();
      });
    });
};
