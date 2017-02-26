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
				var newQuantity = res[0].stock_quantity - quantity;
				var cost = res[0].price * quantity;
				checkOut(id, newQuantity, cost);
			}else {
				console.log("Insufficient quantity!");
				process.exit();
			}
		});

	});
};

var checkOut = function(id, newQuantity, cost){
	connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQuantity}, {item_id: id}], function(err, res){
		if(err) throw err;
		console.log(`Your total cost today was $${parseFloat(cost).toFixed(2)}`);
		process.exit();
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

