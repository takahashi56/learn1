// src/controllers/tutorstudent.js
var mongoose = require('mongoose'),
	Tutor = mongoose.model('Tutor'),
	Student = mongoose.model('Student'),
	Course = mongoose.model('Course'),
	Take = mongoose.model('Take'),
	encrypt = require('../utilities/encryption');


exports.getAllStudents = function(req, res) {
  	Student.find({}, function(err, students){
  		if(err) return console.error(err)

  		res.send(students);
  	})
}

exports.getAllCourses = function(req, res) {
  	Course.find({}, function(err, courses){
  		if(err) return console.error(err)

  		var main_data = [];
  		courses.forEach(function (course) {
  			Take.find({course_id: course.id}, function(err, takes){
				if(err) return console.error(err)

				var data = {
					course_id: course._id,
					coursetitle: course.name,
					enrolled: takes.length,
					coursedescription: course.description
				}

				main_data.push(data);

				if(main_data.length == courses.length){
					res.send(main_data);
				}
			})
  		});
  		
  	})
}

exports.addStudent = function(req, res) {
	var student = req.body;

	student["created_at"] = new Date();

	Student.create(student, function(err, student){
		if(err) return console.error(err);

		res.send({success: true});
	})	
}

exports.addStudentCSV = function(req, res) {
  res.send({data: "add Tutor"});
}

exports.editStudent = function(req, res) {
  var student = req.body;

	student["updated_at"] = new Date();

	Student.update({_id: student._id}, student, function(err, student){
		if(err) return console.error(err);
		
		res.send({success: true});
	})	
}

exports.deleteStudent = function(req, res) {
  res.send({data: "add Tutor"});
}
