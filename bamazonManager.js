var mysql = require('mysql');
var inquirer = require('inquirer');
var prompt = require('prompt');

var connection = mysql.createConnection({
	host: '127.0.0.1',
	port: '8889',

	user: 'root',
	password: 'root',
	database: 'bamazon'
});

var viewProducts = function(){
	connection.query("SELECT * FROM products", function(err, res){
		if(err) throw err;

		for(var i = 0; i < res.length; i++){
			console.log(`ID: ${res[i].item_id} | Product Name: ${res[i].product_name} | Department: ${res[i].department_name} | Price: ${parseFloat(res[i].price).toFixed(2)} | Quantity: ${res[i].stock_quantity}`);
		};
		start();
	});
};

var viewLowInventory = function(){
	connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res){
		if(err) throw err;

		if(res = []){
			console.log("No inventory items are at or below a quantity of 5");
		}else {
			for(var i = 0; i < res.length; i++){
				console.log(`ID: ${res[i].item_id} | Product Name: ${res[i].product_name} | Department: ${res[i].department_name} | Price: ${parseFloat(res[i].price).toFixed(2)} | Quantity: ${res[i].stock_quantity}`);
			};
		}
		start();
	});
};

var addToInventory = function(){
	console.log('');
	console.log("Add to which item?");
	console.log('');

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

			connection.query("SELECT * FROM products WHERE item_id= ?", [id], function(err, res){
				if(err) throw err;

				var newQuantity = parseInt(res[0].stock_quantity) + parseInt(quantity);
				updateInventory(id, newQuantity);
			});
		});

	});

};

var updateInventory = function(id, newQuantity){
	connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQuantity}, {item_id: id}], function(err, res){
		if(err) throw err;
		viewProducts();
	});
};

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
		var product = data.product;
		var department = data.department;
		var price = parseFloat(data.price).toFixed(2);
		var quantity = parseInt(data.quantity);

		connection.query("INSERT INTO products SET ?", {product_name: product, department_name: department, price: price, stock_quantity: quantity}, function(err, res){
			if(err) throw err;
			viewProducts();
		});
	});
};

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

