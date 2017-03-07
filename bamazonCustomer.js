//include module for MySQL
var mysql = require('mysql');
//include prompt module to take user input 
var prompt = require('prompt');

//connect to database created in MySQL Workbench
var connection = mysql.createConnection({
	host: '127.0.0.1',
	port: '8889',

	user: 'root',
	password: 'root',
	database: 'bamazon'
});

//prompt allows the user to select the id and quantity of the item they want
var addToCart = function(){
	console.log('');
	console.log("Make your selection!");
	console.log('');

	prompt.start();

	prompt.get(['id', 'quantity'], function (err, res) {
		var id = res.id;
		var quantity = res.quantity;

		//if the id has a quantity over 0, then save all the relevent info and pass it into checkOut
		//else, warn the user and exit the program
		connection.query("SELECT * FROM products WHERE item_id= ?", [id], function(err, res){
			if(err) throw err;

			if(res[0].stock_quantity >= quantity){
				//if there are no sales yet, set to 0.00
				var productSales = res[0].product_sales || 0.00;
				//set the new quantity to the stock minus number purchased
				var newQuantity = res[0].stock_quantity - quantity;
				var cost = res[0].price * quantity;
				var department = res[0].department_name;
				checkOut(id, productSales, newQuantity, cost, department);
			}else {
				console.log("Insufficient quantity!");
				process.exit();
			}
		});

	});
};


var checkOut = function(id, productSales, newQuantity, cost, department){
	//totalSales will be set to the running productSales + the cost set in addToCart
	var totalSales = productSales + cost;
	//update products database, set stock_quantity = to newQuantity and product_sales = totalSales where item_id = id
	connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQuantity, product_sales: totalSales}, {item_id: id}], function(err, res){
		if(err) throw err;
		console.log(`Your total cost today was $${parseFloat(cost).toFixed(2)}`);
	});
	//pass in department from addToCart to updateProducts
	updateProducts(department);
};

var updateProducts = function(department){
	var departmentSales = 0;
	//select all rows from products database where the department name = name passed in
	connection.query("SELECT * FROM products WHERE department_name= ?", [department], function(err, res){
		if(err) throw err;
		//sum up all product sales for the selected department
		for(var i = 0; i < res.length; i++){
			departmentSales += res[i].product_sales;
		};
		//pass that modified departmentSales var into the departments database where the department name matches
		connection.query("UPDATE departments SET ? WHERE ?", [{total_sales: departmentSales},{department_name: department}], function(err, res){
			if(err) throw err;
			process.exit();
		});
	});
};

//connects to database and displays every row, then runs addToCart
connection.query("SELECT * FROM products", function(err, res){
	console.log("=====================");
	console.log("Welcome to Bamazon");
	console.log("======================");

	for(var i = 0; i < res.length; i++){
		console.log(`ID: ${res[i].item_id} | Product Name: ${res[i].product_name} | Department: ${res[i].department_name} | Price: ${parseFloat(res[i].price).toFixed(2)} | Quantity: ${res[i].stock_quantity}`);
	};

	addToCart();
});
