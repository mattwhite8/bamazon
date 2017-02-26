var mysql = require('mysql');

var connection = mysql.createConnection({
	host: '127.0.0.1',
	port: '8889',

	user: 'root',
	password: 'root',
	database: 'bamazon'
});

connection.query("SELECT * FROM products", function(err, res){
	for(var i = 0; i < res.length; i++){
		console.log(`ID: ${res[i].item_id} | Product Name: ${res[i].product_name} | Department: ${res[i].department_name} | Price: ${res[i].price} | Quantity: ${res[i].stock_quantity}`);
	};
});