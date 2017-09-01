## Bamazon
* Description: Bamazon is a set of 3 Node Js apps (bamazonCustomer.js, bamazonManager.js, bamazonSupervisor.js) oriented to manipulate persistent data storaged using Mysql as Database Server.

### bamazonCustomer.js 
   bamazonCustomer.js is just like a "Online Shopping Store" where customers make items orders depending on availability in stock.
   This app not only takes orders also decreases items stocks for each order. This app considers 2 (Read and Update) of 4 basic functions of persistent storage in a one Mysql table
*  View the app running at: <https://www.youtube.com/watch?v=_BKhjuaJ7ds>

### bamazonManager.js 
   bamazonManager.js is just like a "back end app" to support the "Online Store" where Manager and staff replenish inventory, add new items, fix items price and assigns their store departments.
   The app considers 3 (Read, Update, Insert)  of 4 basic functions of persistent storage over a one Mysql table
*  View the app running at: <https://www.youtube.com/watch?v=aN8707Lnui4>

### bamazonSupervisor.js 
bamazonSupervisor.js is just like an " analistic report App" used by Financial Controllers and Management for monitoring to the "Online Store" and its financial performance, 
in this case department's profit.  The app considers 3 (Read, Update, Insert)  of 4 basic functions of persistent storage over at least 2 Mysql table, also introduce grouping data as concept.
*  View the app running at: <https://www.youtube.com/watch?v=-Y_6rq8u67k>

### MySql Script
Following, the SQL and MySQL statements set, that it's been used  to create and modify the structures where the data used by the apps are placed, add the first data and also the Select Statement that were coded in the program for read and show data.

/" Create database "/
* create database bamazon;

/" Use database created "/
* use bamazon;

/" create table products "/
* create table products (
  item_id integer(10) not null auto_increment,
  product_name varchar(100),
  department_name varchar(10),
  price decimal(10,2),
  stock_quantity integer (10),
  primary key (item_id)
  );

/" Insert Statements to first load table "/
* insert into products (department_name,over_head_cost) values ("Louisville Bat","Sports",50.20,10);
* insert into products (product_name,department_name,price,stock_quantity) values ("Fender Acoustic Guitar","Instrument",49.60,5);
* insert into products (product_name,department_name,price,stock_quantity) values ("Aloe Lotion","PSNL Care",10.60,3);
* insert into products (product_name,department_name,price,stock_quantity) values ("Harina PAN","Groceries",4.26,15);
* insert into products (product_name,department_name,price,stock_quantity) values ("Ninja Tablet","Electronic",350.00,7);
* insert into products (product_name,department_name,price,stock_quantity) values ("Becoming a Millionaire with Javascript by Alex Haddad","Books",29.99,14);
* insert into products (product_name,department_name,price,stock_quantity) values ("Soft Couch","Furnitures",50.20,10);
* insert into products (product_name,department_name,price,stock_quantity) values ("Baranta Red Wine","Liquors",50.20,10);
* insert into products (product_name,department_name,price,stock_quantity) values ("Latin Percussion Drums","Instrument",50.20,10);
*insert into products (product_name,department_name,price,stock_quantity) values ("Max Hammer","HW Store",16.78,4);

/" create table department "/
* create table departments (
  department_id integer(10) not null auto_increment,
  department_name varchar(50),
  over_head_costs decimal(10,2),
  primary key (department_id)
 );
  
/" Alter tables needed to bamazonSupervisor.js works appropiate "/
 * Alter table products add column product_sales decimal(10,2);
 * Alter table products modify column department_name varchar(50);
  
/" Insert Statement to load department table taking the product table as data source ((floor(rand() similar to Math.Floor 
   and Math.random js functions to get a random number"/
 * insert into departments (department_name,over_head_costs) select products.department_name,(floor(rand()*(9-1+1)+1)* 10000) as over_head_cost from products group by department_name order by count(*) desc;

####  Select Statements used by the apps
     BamazonSupervisor.js - View Product Sales by Department
   * Select 
     department_id,
     department_name,
     over_head_costs,
     COALESCE((select sum(product_sales) from products where products.department_name = departments.department_name and    products.department_name is not null group by products.department_name),0) as product_sales,
    -over_head_costs + COALESCE((select sum(product_sales) from products where products.department_name = departments.department_name  and products.department_name is not null group by products.department_name),0) as total_profit
    from departments where department_id is not null;
 ####
     BamazonManager.js - View Products for Sale
   * select item_id,product_name,price,stock_quantity from products
