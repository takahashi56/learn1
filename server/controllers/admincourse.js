// src/controllers/admincourse.js
var mongoose = require('mongoose'),
	Admin = mongoose.model('Admin'),
	Course = mongoose.model('Course'),
	Lesson = mongoose.model('Lesson'),
	encrypt = require('../utilities/encryption');

exports.getAllCourse = function(req, res) {
	// if(!req.admin) {
	// 	res.status(404);
	// 	res.send({error: 'Admin is not logged in, and can\'t access that data.'});
	// } else {
		Course.find({}, function(err, collection) {
			if(err) {
				res.send({error: err});
			}
			res.send(collection);
		});
	// }
}

exports.addCourse = function(req, res) {
	res.send({data: "add Course"})
}

exports.addLesson = function(req, res) {
	res.send({data: "add Lesson"})
}

exports.editCourse = function(req, res) {
	res.send({data: "edit course"})
}

exports.editLesson = function(req, res) {
	res.send({data: "edit lesson"})
}

exports.deleteCourse = function(req, res) {
	res.send({data: "delete Course"});
}
