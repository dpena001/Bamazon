var mysql = require("mysql");
var inquirer = require('inquirer');
inquirer.registerPrompt('list-input', require('inquirer-list-input'));
var clear = require('clear');
require('console.table');

var connection = mysql.createConnection({
            host: "localhost",
            port: 3306,
            user: 'root',
            password: "Cochito001",
            database: "bamazon"
 });

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
});

function displaymenu(){
clear();
console.log("               ");
inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'Choose an option: ',
      choices: ['View Products Sales by Department','Create New Deparment','Exit'],
    }]).then(function(answers) {
        switch (answers.action){
        case "View Products Sales by Department":
            viewproductsales();
            break;
        case "Create New Deparment":
            createdepartments();
            break;
        case "Exit":
            connection.end();
             process.exit();
            break;
        }
    });
}

function viewproductsales(){
 var query = "select department_id,department_name,over_head_costs,COALESCE((select sum(product_sales) from products where products.department_name = departments.department_name and products.department_name is not null group by products.department_name),0) as product_sales,";
 query = query +" -over_head_costs + COALESCE((select sum(product_sales) from products where products.department_name = departments.department_name and products.department_name is not null group by products.department_name),0) as total_profit";
 query = query +" from departments where department_id is not null;";
 console.log(query);
  connection.query(query, function (error, results) {
   if (error) throw error;
      clear();
      console.log("                  ");
      console.table(results);
      inquirer
      .prompt([{
            type: 'confirm',
            name: 'action',
            message: 'Return Main Menu:'
     }]).then(function(answers){
           displaymenu();
           return;
     });
  });
}


function createdepartments(){
  var query = 'select department_id,department_name,over_head_costs from departments'
  connection.query(query, function (error, results) {
   if (error) throw error;
      clear();
      console.log("                  ");
      console.table(results);
      console.log("                  ");
      console.log("Adding New Department");
      console.log("---------------------");
    inquirer
      .prompt([{
         name: "department_name",
         type: "input",
         message: "Department Name: ",
      },{
         name: "over_head_costs",
         type: "input",
         message: "Over Head Costs: ",
      }])
      .then(function (answer) {
         if (answer.department_name !== null && answer.department_name !== '' && answer.over_head_costs !== null && isNaN(answer.over_head_costs) === false){
            var query1 = "insert into departments (department_name,over_head_costs) values ('"+answer.department_name;
            query1 = query1 + "',"+answer.over_head_costs+");";
         
            connection.query(query1,function (error1, results1) {
            
            if (error1) throw error1;
            
            if (results1.affectedRows === 0){
                console.log("Department Id Invalid!");
                setTimeout(createdepartments, 1000);
                return;
            }else if (!isNaN(answer.over_head_costs)){
                    console.log("                            ");
                    console.log("**********************************");
                    console.log("* Department Successfully Added! *");
                    console.log("**********************************");
                    console.log("                            ");
                    inquirer
                    .prompt([{
                    name: "suboption",
                    type: "confirm",
                    message: "Do you want to continue adding Departments ",
                    }]).then(function(answer2) {
                         if (answer2.suboption){
                            createdepartments();
                            return;
                         }else{
                            displaymenu();
                            return;
                         }
                   });
                
            }else{
                console.log("Sorry! Over Head Costs must be a Number!\n");
                setTimeout(createdepartments, 1000);
            }
      });
   }else{
     console.log("Sorry! You must enter all information! or Over Head Costs must be a Number!\n");
     setTimeout(createdepartments, 1000);
   }
 });
});
}





displaymenu();