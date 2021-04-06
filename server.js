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
          "View Employees by Department",
          "View Employees by Role",
          "Add Employee",
          "Add Department",
          "Add Role",
          "Remove Employee",
          "Update Employee Role",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.initPrompt) {
        case "View All Employees":
          viewEmployees();
          break;
        case "View Employees by Department":
          getDept();
          break;
        case "View Employees by Role":
          getRole();
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
          getEmployeesArrayUpdate();
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
  connection.query(newRole, function (error, results, fields) {});
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

// Gets an array of employees in database then calls Update Employees
const getEmployeesArrayUpdate = () => {
  connection.query(
    "SELECT first_name, last_name, id FROM employee_db.Employee; SELECT title, id FROM employee_db.Role",
    function (error, results, fields) {
      const resultsString = JSON.stringify(results);
      const resultsArray = JSON.parse(resultsString);
      updateEmployeePrompt(resultsArray[0], resultsArray[1]);
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

// Gets list of employees and prompts user which they would like to remove, then removes
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
      const deleteQuery = `DELETE FROM employee_db.Employee WHERE (id = '${answer.remove}');`;
      connection.query(deleteQuery, function (error, results, fields) {});
      initialQuestions();
    });
};

const updateEmployeePrompt = (results) => {
  const employeesArrayUpdate = [];
  for (let i = 0; i < results.length; i++) {
    const employeeObject = {};
    const element = results[i].first_name + " " + results[i].last_name;
    employeeObject.name = element;
    employeeObject.value = results[i].id;
    employeesArrayUpdate.push(employeeObject);
  }
  inquirer
    .prompt([
      {
        type: "list",
        name: "updateEmployee",
        message: "Which employee would you like to update?",
        choices: employeesArrayUpdate,
      },
      {
        type: "list",
        name: "updateRole",
        message: "What would you like to update for this employee?",
        choices: ["Update Role", "Update Salary", "Update Manager"],
      },
    ])
    .then((answer) => {
      switch (answer.updateRole) {
        case "Update Role":
          // calls next function and passes ID of Employee
          getRoleUpdate(answer.updateEmployee);
          break;
        case "Update Salary":
          console.log("update salary");
        case "Update Manager":
          console.log("update manager");
        default:
          initialQuestions();
          break;
      }
    });
};

// Should receive employee ID and
const updateRole = (employeeID, results) => {
  const employeeRoleUpdate = employeeID;
  const roleArrayUpdate = [];
  for (let i = 0; i < results.length; i++) {
    const roleObject = {};
    const element = results[i].title;
    roleObject.name = element;
    roleObject.value = results[i].id;
    roleArrayUpdate.push(roleObject);
  }
  inquirer
    .prompt([
      {
        type: "list",
        name: "chooseRole",
        message: "Choose a new role for this employee",
        choices: roleArrayUpdate,
      },
    ])
    .then((answer) => {
      const updateRoleQuery = `UPDATE Employee SET role_id = ${answer.chooseRole} WHERE id = ${employeeRoleUpdate};`;
      connection.query(updateRoleQuery, function (error, results, fields) {});
      initialQuestions();
    });
};

// Displays list of employees first name, last name, job title, and role id.
const viewEmployees = () => {
  connection.query(
    "SELECT Employee.first_name, Employee.last_name, Role.title, Employee.role_id FROM Role INNER JOIN Employee ON Role.id = Employee.role_id;",
    function (error, results, fields) {
      console.table(" ", results);
      initialQuestions();
    }
  );
};

// Getting list of departments to display in prompt.
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

// Getting list of Roles to display in prompt
const getRole = () => {
  connection.query(
    "SELECT title, id FROM employee_db.Role;",
    function (error, results, fields) {
      const resultsString = JSON.stringify(results);
      const resultsArray = JSON.parse(resultsString);
      viewByRolePrompt(resultsArray);
    }
  );
};

// Getting list of Roles to display in prompt for update function
const getRoleUpdate = (employeeID) => {
  connection.query(
    "SELECT title, id FROM employee_db.Role;",
    function (error, results, fields) {
      const resultsString = JSON.stringify(results);
      const resultsArray = JSON.parse(resultsString);
      updateRole(employeeID, resultsArray);
    }
  );
};

// Prompts user for which department they want to view then displays all employees in that department.
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

// Prompts user for which role they want to view employees of, then displays all employees in that department.
const viewByRolePrompt = (results) => {
  const roleArray = [];
  for (let i = 0; i < results.length; i++) {
    const roleObject = {};
    const roleName = results[i].title;
    roleObject.name = roleName;
    roleObject.value = results[i].id;
    roleArray.push(roleObject);
  }
  inquirer
    .prompt([
      {
        type: "list",
        name: "role",
        message: "Which role would you like to view?",
        choices: roleArray,
      },
    ])
    .then((answer) => {
      const roleQuery = `SELECT Employee.first_name, Employee.last_name FROM Employee WHERE role_id=${answer.role};`;
      connection.query(roleQuery, function (error, results, fields) {
        console.table(" ", results);
        initialQuestions();
      });
    });
};
