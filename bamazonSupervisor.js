//include module for MySQL
var mysql = require('mysql');
//creates a menu for the user
var inquirer = require('inquirer');
//include prompt module to take user input 
var prompt = require('prompt');
//console table will print out the results in the terminal 
require('console.table');

//connect to database created in MySQL Workbench
var connection = mysql.createConnection({
	host: '127.0.0.1',
	port: '8889',

	user: 'root',
	password: 'root',
	database: 'bamazon'
});

var viewDepartment = function(){
	//select all rows from the departments database
	connection.query("SELECT * FROM departments", function(err, res){
		var arr = [];
		//loop through data, pushing the relevant info into the arr to be read by console.table
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

//use prompt to pass the relevant info into an insert statement 
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

