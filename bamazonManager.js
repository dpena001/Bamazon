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
inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'Choose an option: ',
      choices: ['View Products for Sale','View Low Inventory','Add to Inventory','Add New Product','Exit'],
    }]).then(function(answers) {
        switch (answers.action){
        case "View Products for Sale":
            viewproducts();
            break;
        case "View Low Inventory":
            viewlowinventary();
            break;
        case "Add to Inventory":
            addinventory();
            break;
        case "Add New Product":
            addnewproduct();
            break;
        case "Exit":
            connection.end();
             process.exit();
            break;
        }
    });

}

function viewproducts(){
  var query = 'select item_id,product_name,price,stock_quantity from products'
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

function viewlowinventary(){
  var query = 'select item_id,product_name,price,stock_quantity from products where stock_quantity < 5'
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

function addinventory(){
  var query = 'select item_id,product_name,price,stock_quantity from products'
  connection.query(query, function (error, results) {
   if (error) throw error;
      clear();
      console.log("                  ");
      console.table(results);
      console.log("                  ");
      console.log("Updating Inventory");
      console.log("------------------");
    inquirer
      .prompt([{
         name: "item",
         type: "input",
         message: "Choose the Item id to add it more quantity: ",
      },{
         name: "quantity",
         type: "input",
         message: "Quantity?: ",
     }])
      .then(function (answer) {
         var query1 = "SELECT product_name,stock_quantity,price FROM products where?";
          connection.query(query1, { item_id : answer.item },function (error, results) {
            if (error) throw error;
            
            if (results.length === 0){
                console.log("Item Id Invalid!");
                setTimeout(addinventory, 2500);
                return;
            }else if (answer.quantity % 1 === 0){
                var db_stock_number = parseInt(results[0].stock_quantity);
                var user_quantity = parseInt(answer.quantity);
                var p = db_stock_number + user_quantity;
                var query2 = "update products set stock_quantity ="+p+" where?";
                connection.query(query2, { item_id : answer.item },function (error1, results1) {
                    if (error1) throw error1;
                    console.log("                               ");
                    console.log("*******************************");
                    console.log("* Update has been Successful! *");
                    console.log("*******************************");
                    console.log("                               ");
                    console.log("The Current Stock Quantity of '"+results[0].product_name+"'' are "+p);
                    console.log("                               ");
                    inquirer
                    .prompt([{
                    name: "suboption",
                    type: "confirm",
                    message: "Do you want to continue adding Items ",
                    }]).then(function(answer2) {
                         if (answer2.suboption){
                            addinventory();
                            return;
                         }else{
                            displaymenu();
                            return;
                         }
                   });
                });    
            }else{
                console.log("Sorry! Quantity Must be an Integer Number!\n");
                setTimeout(addinventory, 2500);
            }
      });
   });
 });
}       

function addnewproduct(){
  var query = 'select item_id,product_name,price,stock_quantity from products'
  connection.query(query, function (error, results) {
   if (error) throw error;
      clear();
      console.log("                  ");
      console.table(results);
      console.log("                  ");
      console.log("Adding New Product");
      console.log("------------------");
    inquirer
      .prompt([{
         name: "product_name",
         type: "input",
         message: "Product Name: ",
      },{
         name: "department_name",
         type: "input",
         message: "Department Name: ",
      },{
         name: "price",
         type: "input",
         message: "Unit Price: ",
      },{
         name: "stock_quantity",
         type: "input",
         message: "Stock Quantity: ",
     }])
      .then(function (answer) {
         if (parseInt(answer.stock_quantity) % 1 === 0 && answer.product_name !== null && answer.department_name !== null && answer.price !== null ){
            var query1 = "insert into products (product_name,department_name,price,stock_quantity) values ('"+answer.product_name;
            query1 = query1 + "','"+answer.department_name+"',"+answer.price+","+answer.stock_quantity+");";
            connection.query(query1,function (error1, results1) {
            
            if (error1) throw error1;
            
            if (results1.affectedRows === 0){
                console.log("Item Id Invalid!");
                setTimeout(addnewproduct, 1000);
                return;
            }else if (parseInt(answer.stock_quantity) % 1 === 0){
                    console.log("                            ");
                    console.log("****************************");
                    console.log("* Item Successfully Added! *");
                    console.log("****************************");
                    console.log("                            ");
                    inquirer
                    .prompt([{
                    name: "suboption",
                    type: "confirm",
                    message: "Do you want to continue adding Items ",
                    }]).then(function(answer2) {
                         if (answer2.suboption){
                            addnewproduct();
                            return;
                         }else{
                            displaymenu();
                            return;
                         }
                   });
                
            }else{
                console.log("Sorry! Quantity must be an Integer Number!\n");
                setTimeout(addnewproduct, 1000);
            }
      });
   }else{
     console.log("Sorry! You must enter all information!\n");
     setTimeout(addnewproduct, 1000);
   }
 });
});
}

displaymenu();