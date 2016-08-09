// src/controllers/tutorstudent.js
var mongoose = require('mongoose'),
	Tutor = mongoose.model('Tutor'),
	Student = mongoose.model('Student'),
	encrypt = require('../utilities/encryption');


exports.getAllStudents = function(req, res) {
  res.send({data: "add Tutor"});
}

exports.addStudent = function(req, res) {
  res.send({data: "add Tutor"});
}

exports.addStudentCSV = function(req, res) {
  res.send({data: "add Tutor"});
}

exports.editStudent = function(req, res) {
  res.send({data: "add Tutor"});
}

exports.deleteStudent = function(req, res) {
  res.send({data: "add Tutor"});
}
