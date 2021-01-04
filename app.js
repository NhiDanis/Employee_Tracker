const inquirer = require("inquirer");
const mysql = require("mysql");
const table = require("console.table");


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_DB"
  });

  //========== Connection ID ==========================//
connection.connect(function(err) {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`);
    startPrompt();

});

function startPrompt() {
    inquirer.prompt([
    {
    type: "list",
    message: "What would you like to do?",
    name: "choice",
    choices: [
              "View All Employees?", 
              "View All Employee's By Roles?",
              "View all Employee's By Deparments", 
              "Update Employee",
              "Add Employee?",
              "Add Role?",
              "Add Department?"
            ]
    }
]).then(function(val) {
        switch (val.choice) {
            case "View All Employees?":
              viewAllEmployees();
            break;
    
          case "View All Employee's By Roles?":
              viewAllRoles();
            break;
          case "View all Emplyees By Deparments":
              viewAllDepartments();
            break;
          
          case "Add Employee?":
                addEmployee();
              break;

          case "Update Employee":
                updateEmployee();
              break;
      
            case "Add Role?":
                addRole();
              break;
      
            case "Add Department?":
                addDepartment();
              break;
    
            }
    })
}