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