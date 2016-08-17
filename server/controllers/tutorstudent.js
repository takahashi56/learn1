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
  		var students_copy = [];

  		students.forEach(function (student) {
  			var s = {
  				student_id: student._id,
  				username: student.username,
  				firstName: student.firstName,
  				lastName: student.lastName,
  				DOB: student.DOB,
  				hashed_pwd: student.hashed_pwd,
  				isSelected: false,
  			};
  			students_copy.push(s);
  		});

  		res.send(students_copy);
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

exports.setStudentByCourse = function(req, res){
	var course_id = req.body.course_id, 
		students_ids = req.body.ids;

	console.log("course_id");
	console.log(course_id);
	console.log(students_ids);

	students_ids.map(function(id){
		Take.find({student_id: id}, function(err, takes){
			if(err) return console.log(err);

			let confirm = takes.filter((x)=> x.course_id == course_id);

			console.log(confirm);
			
			if(confirm.length == 0){
				var data = {
					student_id: id,
					course_id: course_id,
					score: 0,
					isCompleted: false,
					completedAt: '',
					certificate: ''
				}
				console.log(data);
				Take.create(data, function(err, take){
					if(err) return console.log(err);

					console.log(take);
				});
			}
		})
	})
}

exports.getCoursesByStudentId = function(req, res){
	var id = req.body.student_id;

	Take.find({student_id: id}, function(err, takes){
		if(err) return console.log(err);
		var courses = [];

		takes.forEach(function(take){
			Course.findOne({_id: take.course_id}, function(err, course){

				var data = {
					coursetitle: course.name,
					isCompleted: take.isCompleted,
					score: take.score,
					completedAt: take.completedAt,
					certificate: take.certificate,
				}
				courses.push(data);

				if(courses.length == takes.length){
					res.send(courses);
				}
			})
		})
	})
}

exports.getStudentsByCourseId = function(req, res){
	var id = req.body.course_id;

	Take.find({course_id: id}, function(err, takes){
		if(err) return console.log(err);
		var courses = [];

		takes.forEach(function(take){
			Student.findOne({_id: take.student_id}, function(err, student){

				var data = {
					firstName: student.firstName,
					lastName: student.lastName,
					isCompleted: take.isCompleted,
					score: take.score,
					completedAt: take.completedAt,
					certificate: take.certificate,
				}
				courses.push(data);

				if(courses.length == takes.length){
					res.send(courses);
				}
			})
		})
	})	
}