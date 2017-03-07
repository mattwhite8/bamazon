//include module for MySQL
var mysql = require('mysql');
//creates a menu for the user
var inquirer = require('inquirer');
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

//select all rows from products database and loop through them to display
var viewProducts = function(){
	connection.query("SELECT * FROM products", function(err, res){
		if(err) throw err;

		for(var i = 0; i < res.length; i++){
			console.log(`ID: ${res[i].item_id} | Product Name: ${res[i].product_name} | Department: ${res[i].department_name} | Price: ${parseFloat(res[i].price).toFixed(2)} | Quantity: ${res[i].stock_quantity}`);
		};
		start();
	});
};

//select all rows from products database where the stock_quantity is less than or equal to 5
var viewLowInventory = function(){
	connection.query("SELECT * FROM products WHERE stock_quantity <= ?",[parseInt(5)], function(err, res){
		if(err) throw err;

		if(typeof res[0] !== 'undefined'){
			for(var i = 0; i < res.length; i++){
				console.log(`ID: ${res[i].item_id} | Product Name: ${res[i].product_name} | Department: ${res[i].department_name} | Price: ${parseFloat(res[i].price).toFixed(2)} | Quantity: ${res[i].stock_quantity}`);
			};
		}else {
			console.log("No inventory items are at or below a quantity of 5");
		};

		start();
	});
};

var addToInventory = function(){
	console.log('');
	console.log("Add to which item?");
	console.log('');

	//select all rows from products and display them, allow the user to select the id and quantity to add
	connection.query("SELECT * FROM products", function(err, res){
		if(err) throw err;

		for(var i = 0; i < res.length; i++){
			console.log(`ID: ${res[i].item_id} | Product Name: ${res[i].product_name} | Department: ${res[i].department_name} | Price: ${parseFloat(res[i].price).toFixed(2)} | Quantity: ${res[i].stock_quantity}`);
		};

		console.log('');
		console.log("Choose your id and quantity to add");

		prompt.start();

		prompt.get(['id', 'quantity'], function(err, res){
			var id = res.id;
			var quantity = res.quantity;

			//take the id provided and return the row that matches
			connection.query("SELECT * FROM products WHERE item_id= ?", [id], function(err, res){
				if(err) throw err;
				//add the existing quantity and the quantity derived from prompt
				var newQuantity = parseInt(res[0].stock_quantity) + parseInt(quantity);
				//pass that data into updateInventory
				updateInventory(id, newQuantity);
			});
		});

	});

};

//update the products database, set the new stock_quantity where the item_id matches the id passed in
var updateInventory = function(id, newQuantity){
	connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQuantity}, {item_id: id}], function(err, res){
		if(err) throw err;
		viewProducts();
	});
};

//use inquirer to take relevant info from the user
var addNewProduct = function(){
	inquirer.prompt([

		{
			type: "input",
			message: "Enter the Product Name",
			name: "product",
			default: ""
		},

		{
			type: "input",
			message: "Enter the Department Name",
			name: "department",
			default: ""
		},

		{
			type: "input",
			message: "Enter the Price",
			name: "price",
			default: ""
		},

		{
			type: "input",
			message: "Enter the Quantity in Stock",
			name: "quantity",
			default: ""
		}

	]).then(function(data){
		//pass the user supplied data into variables
		var product = data.product;
		var department = data.department;
		var price = parseFloat(data.price).toFixed(2);
		var quantity = parseInt(data.quantity);

		//insert a new row into products database using the user supplied data
		connection.query("INSERT INTO products SET ?", {product_name: product, department_name: department, price: price, stock_quantity: quantity}, function(err, res){
			if(err) throw err;
			viewProducts();
		});
	});
};

//run start() on start and allow the user to choose their desired option
var start = function(){
	console.log('');
	console.log("=====================");
	console.log("Welcome to Bamazon");
	console.log("=====================");
	console.log('');

	inquirer.prompt([

		{
			type: "list",
			message: "What would you like to do?",
			choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product", "Quit"],
			name: "choices"
		}

	]).then(function(data){
		switch(data.choices){
			case "View Products For Sale":
				viewProducts();
				break;
			case "View Low Inventory":
				viewLowInventory();
				break;
			case "Add To Inventory":
				addToInventory();
				break;
			case "Add New Product":
				addNewProduct();
				break;
			case "Quit":
				process.exit();
				break;
		};
	});	
};

start();

