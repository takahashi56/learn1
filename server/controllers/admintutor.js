// src/controllers/admintutor.js
var mongoose = require('mongoose'),
	Admin = mongoose.model('Admin'),
	Tutor = mongoose.model('Tutor'),
	encrypt = require('../utilities/encryption');

exports.getAllTutors = function(req, res) {
	res.send({data: "Get All tutors"});
}
exports.addTutor = function(req, res) {
	res.send({data: "add Tutor"});
}

exports.editTutor = function(req, res) {
	res.send({data: "edit Tutor"});
}
exports.deleteTutor = function(req, res) {
	res.send({data: "delete Tutor"});
}
