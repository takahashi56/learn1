// src/controllers/login.js
var mongoose = require('mongoose'),
	Student = mongoose.model('Student'),
	Tutor = mongoose.model('Tutor'),
	encrypt = require('../utilities/encryption');

exports.login = function(req, res) {
	res.send({data: "add Tutor"});
}

exports.admiLogin = function(req, res) {
	res.send({data: "add Tutor"});
}

exports.studentLogin = function(req, res) {
	res.send({data: "add Tutor"});
}

exports.tutorLogin = function(req, res) {
	res.send({data: "add Tutor"});
}

exports.resetPassword = function(req, res) {
	res.send({data: "reset password"});
}