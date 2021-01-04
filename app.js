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