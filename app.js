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
          case "View all Employee's By Deparments":
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

// View All Employee //
function viewAllEmployees() {
    let query = "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;"
    connection.query(query, function(err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
  })
}

// View All Department //

function viewAllDepartments() {
    let query = "SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;"
    connection.query(query, function(err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
    })
}

// View All Roles //

function viewAllRoles() {
    let query = "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;"
    connection.query(query, function(err, res) {
    if (err) throw err
    console.table(res)
    startPrompt()
    })
}

// Add Employee //

var roleArr = [];
function selectRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

  })
  return roleArr;
}

var managersArr = [];
function selectManager() {
    let query = "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL"
  connection.query(query, function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
}

function addEmployee() { 

    inquirer.prompt([
        {
          name: "firstname",
          type: "input",
          message: "Enter the first name "
        },
        {
          name: "lastname",
          type: "input",
          message: "Enter the last name "
        },
        {
          name: "role",
          type: "list",
          message: "What is their role? ",
          choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Whats their managers name?",
            choices: selectManager()
        }
    ]).then(function (val) {
      let roleId = selectRole().indexOf(val.role) + 1
      let managerId = selectManager().indexOf(val.choice) + 1
      connection.query("INSERT INTO employee SET ?", 
      {
          first_name: val.firstname,
          last_name: val.lastname,
          manager_id: managerId,
          role_id: roleId
          
      }, function(err){
          if (err) throw err
          console.table(val)
          viewAllEmployees()
      })
  });

}

// Update Employee //

function updateEmployee() {
    let query = "SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;"
    connection.query(query, function(err, res) {
    // console.log(res)
     if (err) throw err
     console.log(res)
    inquirer.prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: function() {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the Employee's last name? ",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the Employees new title? ",
            choices: selectRole()
          },
      ]).then(function(val) {
        //console.log(val)
        // we need the ID of the emp such that val.lastName = employee.lastName
        connection.query("SELECT ID FROM employee WHERE ?",
        {
          last_name: val.lastName,
           
        }, 

        function(err, res){
            if (err) throw err
            const id = res[0].ID
            var roleId = selectRole().indexOf(val.role) + 1
            //UPDATE employee
            //SET column1 = value1, column2 = value2...., columnN = valueN
           // WHERE employee.id = res.id;
           
            connection.query("UPDATE employee SET employee.role_id = ? WHERE employee.id = ?", 
            [roleId, id],
            function(err){
                if (err) throw err
                console.table(val)
                viewAllEmployees()
            })    
        })
  
    });
  });
}

// Add Role //

function addRole() { 
    let query = "SELECT role.title AS Title, role.salary AS Salary FROM role"
    connection.query(query, function(err, res) {
      inquirer.prompt([
          {
            name: "Title",
            type: "input",
            message: "What is the roles Title?"
          },
          {
            name: "Salary",
            type: "input",
            message: "What is the Salary?"
  
          } 
      ]).then(function(res) {
          connection.query(
              "INSERT INTO role SET ?",
              {
                title: res.Title,
                salary: res.Salary,
              },
              function(err) {
                  if (err) throw err
                  console.table(res);
                  startPrompt();
              }
          )
  
      });
    });
  }

  // Add Department

  function addDepartment() { 

    inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "What Department would you like to add?"
        }
    ]).then(function(res) {
        var query = connection.query(
            "INSERT INTO department SET ? ",
            {
              name: res.name
            
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )
    })
};
