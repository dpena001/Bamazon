var mysql = require("mysql");
var inquirer = require('inquirer');
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
     if (err){throw err;}
     else{
        displayitems();

     }
 });


 function displayitems(){ 
      var items = [];
      var query = "SELECT item_id,product_name,price FROM products";

       connection.query(query, function (error, results) {
         if (error) throw error;
            clear();
            console.log("             ");
            console.table(results);
            question();  
     });
 }

function question(){
       inquirer
      .prompt([{
         name: "item",
         type: "input",
         message: "Choose the Item id to Purchase: ",
      },{
         name: "quantity",
         type: "input",
         message: "Quantity?: ",
     }])
      .then(function (answer) {
         //modified query to achieve Challenge #3 adding product_sales column values 
         var query1 = "SELECT product_name,stock_quantity,price,COALESCE(product_sales,0) as product_sales FROM products where?";
          connection.query(query1, { item_id : answer.item },function (error, results) {
            if (error) throw error;
            
            if (results.length === 0){
                console.log("Item Id Invalid!");
                setTimeout(displayitems, 1000);
                return;
            }else if ( results[0].stock_quantity > answer.quantity){
                var db_stock_number = parseInt(results[0].stock_quantity);
                var user_quantity = parseInt(answer.quantity);
                var item_price = parseFloat(results[0].price);
                //to achieve Challenge #3 be added a variable assigning to each item its product sales values accumulated
                var product_sales=parseFloat(results[0].product_sales);

                var p = db_stock_number - user_quantity;
                var m = item_price * user_quantity;
                //to achieve Challenge #3 be assigned to a variable the item's product sales accumulated plus current total amount order
                var o = product_sales + m;
                var query2 = "update products set stock_quantity ="+p+",product_sales ="+o+" where?";
                connection.query(query2, { item_id : answer.item },function (error1, results1) {
                    if (error1) throw error1;
                    console.log("                     ");
                    console.log("********************************");
                    console.log("* order successfully submitted *");
                    console.log("********************************");
                    console.log("                     ");
                    console.log("Thank you for shopping with us. You ordered "+answer.quantity+" of "+results[0].product_name);
                    console.log("Total Order: "+m)
                    console.log("                     ");
                    inquirer
                    .prompt([{
                    name: "suboption",
                    type: "confirm",
                    message: "Do you want to continue shopping?",
                    }]).then(function(answer2) {
                         if (answer2.suboption){
                            displayitems();
                            return;
                         }else{
                            connection.end();
                            process.exit();
                            return;
                         }
                   });
                   // setTimeout(displayitems, 4000);
                });    
            }else{
                console.log("Sorry! Insufficient Quantity!\n");
                setTimeout(displayitems, 1000);
            }
      });
   });
}