// src/controllers/adminlogin.js
var mongoose = require('mongoose'),
	Admin = mongoose.model('Admin'),
	encrypt = require('../utilities/encryption');

exports.login = function(req, res) {
	res.send({data: "admin login"});
}
exports.confirmLogin = function(req, res) {
	res.send({data: "confirm Login"});
}

