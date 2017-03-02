var mysql = require('mysql');
var inquirer = require('inquirer');
var prompt = require('prompt');
require('console.table');

var connection = mysql.createConnection({
	host: '127.0.0.1',
	port: '8889',

	user: 'root',
	password: 'root',
	database: 'bamazon'
});

var viewDepartment = function(){
	connection.query("SELECT * FROM departments", function(err, res){
		var arr = [];
		for(var i = 0; i < res.length; i++){
			arr.push({Id: res[i].department_id,
					  Department: res[i].department_name, 
					  Overhead: parseFloat(res[i].over_head_costs).toFixed(2),
					  Sales: parseFloat(res[i].total_sales).toFixed(2),
					  Profit: parseFloat(res[i].total_sales - res[i].over_head_costs).toFixed(2)});
		};
		console.table(arr);
		start();
	});
};

var createDepartment = function(){
	prompt.start();

	prompt.get(['department', 'overhead'], function(err, res){
		var department = res.department;
		var overhead = res.overhead;

		connection.query("INSERT INTO departments SET ?", {department_name: department, over_head_costs: overhead}, function(err, res){
			if(err) throw err;
			start();
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
			choices: ["View Product Sales by Department", "Create New Department", "Quit"],
			name: "choices"
		}

	]).then(function(data){
		switch(data.choices){
			case "View Product Sales by Department":
				viewDepartment();
				break;
			case "Create New Department":
				createDepartment();
				break;
			case "Quit":
				process.exit();
				break;
		};
	});	
};

start();

