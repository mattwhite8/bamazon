var mysql = require('mysql');
var prompt = require('prompt');

var connection = mysql.createConnection({
	host: '127.0.0.1',
	port: '8889',

	user: 'root',
	password: 'root',
	database: 'bamazon'
});

var addToCart = function(){
	console.log('');
	console.log("Make your selection!");
	console.log('');

	prompt.start();

	prompt.get(['id', 'quantity'], function (err, res) {
		var id = res.id;
		var quantity = res.quantity;

		connection.query("SELECT * FROM products WHERE item_id= ?", [id], function(err, res){
			if(err) throw err;

			if(res[0].stock_quantity >= quantity){
				var productSales = res[0].product_sales || 0.00;
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
	var totalSales = productSales + cost;
	connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQuantity, product_sales: totalSales}, {item_id: id}], function(err, res){
		if(err) throw err;
		console.log(`Your total cost today was $${parseFloat(cost).toFixed(2)}`);
	});
	updateProducts(department);
};

var updateProducts = function(department){
	var departmentSales = 0;
	connection.query("SELECT * FROM products WHERE department_name= ?", [department], function(err, res){
		if(err) throw err;
		for(var i = 0; i < res.length; i++){
			departmentSales += res[i].product_sales;
		};
		connection.query("UPDATE departments SET ? WHERE ?", [{total_sales: departmentSales},{department_name: department}], function(err, res){
			if(err) throw err;
			process.exit();
		});
	});
};

connection.query("SELECT * FROM products", function(err, res){
	console.log("=====================");
	console.log("Welcome to Bamazon");
	console.log("======================");

	for(var i = 0; i < res.length; i++){
		console.log(`ID: ${res[i].item_id} | Product Name: ${res[i].product_name} | Department: ${res[i].department_name} | Price: ${parseFloat(res[i].price).toFixed(2)} | Quantity: ${res[i].stock_quantity}`);
	};

	addToCart();
});
