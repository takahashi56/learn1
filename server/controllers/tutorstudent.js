// src/controllers/tutorstudent.js
var mongoose = require('mongoose'),
	Tutor = mongoose.model('Tutor'),
	Student = mongoose.model('Student'),
	Course = mongoose.model('Course'),
	Take = mongoose.model('Take'),
	Lesson = mongoose.model('Lesson'),
	encrypt = require('../utilities/encryption'),
	csv = require('fast-csv'),
 	pdf = require('pdfcrowd'),
 	path = require('path');

exports.getAllStudents = function(req, res) {
	var data = req.body, tutor_id = data.tutor_id, total = 0, complete = 0;
	console.log(tutor_id);

  	Student.find({tutor_id: tutor_id},null, {sort: 'created_at'}, function(err, students){
  		if(err) return console.error(err)
  		var students_copy = [];

  		students.forEach(function (student) {
  			Take.find({student_id: student._id}).lean().exec(function(err, takes){
  				complete = 0;
  				total = takes.length;
  				for (var i = 0, len = takes.length; i !== len; i++) {
				    if(takes[i].isCompleted) complete++;
				}

				var s = {
	  				student_id: student._id,
	  				username: student.username,
	  				firstName: student.firstName,
	  				lastName: student.lastName,
	  				DOB: student.DOB,
	  				hashed_pwd: student.hashed_pwd,
					phone: student.phone,
	  				isSelected: false,
	  				tutor_id: tutor_id,
	  				other: complete + ' of ' + total
	  			};

	  			students_copy.push(s);
	  			console.log("+++++++++++++++++++++++++++++")
	  			console.log(students_copy.length);
	  			console.log(students.length)
	  			if(students.length == students_copy.length){
	  				students_copy.sort(function(a, b){
			            return a.firstName.localeCompare(b.firstName);    
			          })
	  				res.send(students_copy);			
	  			}
  			})	  			
  		});
  		
  	})
}

exports.getAllCourses = function(req, res) {
	var tutor_id = req.body.tutor_id;
	console.log("tutor id" + tutor_id);
    var main_data = [];
  	Course.find({},null, {sort: 'created_at'}, function(err, courses){
  		if(err) return console.error(err)


  		courses.forEach(function (course) {

  			Take.find({course_id: course._id}, function(err, takes){
  				if(err) return console.error(err)

  				var count = 0, i=0, past = 0;;
                if(takes.length == 0){
                    i++;
                    var data1 = {
                        course_id: course._id,
                        coursetitle: course.name,
                        enrolled: 0,
						past: 0,
                        coursedescription: course.description
                    }
                    main_data.push(data1);
                    if(main_data.length == courses.length){
                        res.send(main_data);

                        return false;
                    }
                }else{
                    takes.forEach(function(take){
                        Student.findOne({_id: take.student_id, tutor_id: tutor_id}, function(err, student){
                            if(err) return console.error(err);

                            i++;
                            console.log(i);
                            console.log(takes.length);
                            if(student != null && take.score  > 0) past++;
							if(student != null && take.score == 0) count++;

                            if(i == takes.length){
                                console.log(course);
                                var data = {
                                    course_id: course._id,
                                    coursetitle: course.name,
                                    enrolled: count,
									past: past,
                                    coursedescription: course.description
                                }
                                main_data.push(data);
                                if(main_data.length == courses.length){
                                	main_data.sort(function(a, b){
							            return a.coursetitle.localeCompare(b.coursetitle);    
							          })
                                    res.send(main_data);

                                    return false;
                                }
                            }
                        })
                    })
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
  	var students = req.body.result, tutor_id=req.body.tutor_id, count=false, ii=0, flag = true;

  	students.forEach(function (studentcsv) {
			ii++;
  		csv.fromString(studentcsv[0], {header: true})
  			.on("data", function(data){
					console.log(data);
  				var student = {
  					firstName: data[0],
  					lastName: data[1],
  					DOB: data[2],
						phone: data[3],
  					username: data[4],
  					hashed_pwd: data[5],
  					tutor_id: tutor_id,
  				}

  				Student.find({}, function(err, sCollection){
  					if(err) throw err;

  					i = 0;
  					sCollection.forEach(function (s) {
  						if(s.username.includes(data[4])) i++;
  					});
  					if(i != 0) student.username = data[4] + i;
  					Student.create(student, function(err, std){
							if(err) return console.log(err);
  						count=true;

							if(ii == students.length && flag == true){
									console.log("++++++++++++++++++++++++++++++++++++++++++++++++++")
									flag = false
									res.send({success: true});

									return false;
							}
  					})
  				})
  			})
  	});

		return false;
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

	console.log('student ids ' + JSON.stringify(students_ids));
	console.log('course id ' + JSON.stringify(course_id));
	students_ids.map(function(id){
		Take.find({student_id: id}, function(err, takes){
			if(err) return console.log(err);

			var confirm = takes.filter(function(x){return x.course_id == course_id});

			console.log('confirm = ' + JSON.stringify(confirm));

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
	res.send({success: true});
}



exports.getCoursesByStudentId = function(req, res){
	var id = req.body.student_id, tutor_id = req.body.tutor_id;

	Take.find({student_id: id},null, {sort: 'created_at'}, function(err, takes){
		if(err) return console.log(err);
		var courses = [];
		var count = 0, i=0;
		takes.forEach(function(take){
			Course.findOne({_id: take.course_id}, function(err, course){
				if(err) return console.error(err);

				i++;

				if(course != null){
					var data = {
						course_id: course._id,
						coursetitle: course.name,
						isCompleted: take.isCompleted,
						score: take.score,
						completedAt: take.completedAt,
						certificate: take.certificate,
					}
					courses.push(data);
				}
				if(i == takes.length){
					res.send(courses);
				}
			})
		})
	})
}

exports.getStudentsByCourseId = function(req, res){
	var id = req.body.course_id, tutor_id = req.body.tutor_id;
	console.log(id);

	// Take.find({course_id: id}, function(err, takes){
	// 	if(err) return console.log(err);
	// 	var courses = [];

	// 	takes.forEach(function(take){
	// 		Student.findOne({_id: take.student_id, tutor_id: tutor_id}, function(err, student){
	// 			if(err) return console.error(err);

	// 			if(student != null){
	// 				var data = {
	// 					firstName: student.firstName,
	// 					lastName: student.lastName,
	// 					isCompleted: take.isCompleted,
	// 					score: take.score,
	// 					completedAt: take.completedAt,
	// 					certificate: take.certificate,
	// 				}
	// 				courses.push(data);

	// 				if(courses.length == takes.length){
	// 					res.send(courses);
	// 				}
	// 			}
	// 		})
	// 	})
	// })


	Take.find({course_id: id},null, {sort: 'created_at'}, function(err, takes){
		if(err) return console.error(err)
		var courses = [];

		var count = 0, i=0;
		takes.forEach(function(take){
			Student.findOne({_id: take.student_id, tutor_id: tutor_id}, function(err, student){
				if(err) return console.error(err);
				i++;

				if(student != null){
					var data = {
						firstName: student.firstName,
						lastName: student.lastName,
						isCompleted: take.isCompleted,
						score: take.score,
						completedAt: take.completedAt,
						certificate: take.certificate,
					}
					courses.push(data);
				}
				if(i == takes.length){
					res.send(courses);
				}
			})
		})
	})
}


exports.removeStudent = function(req, res){
	var list = req.body.list;
	console.log(list);
	list.forEach(function(id){
		Student.findOne({_id: id}, function(err, student){
			if(err) console.error(err);

			student.remove()
		})
	})

	res.send({success: true});
}

exports.getLessonsNameByCourseId = function (req, res) {
	var course_id = req.body.course_id, data = [], date;
	Course.findOne({_id: course_id}, function(err, course){
		if(course.created_at == null){
			date = course.updated_at;
		}else{
			date = course.created_at;
		}
		Lesson.find({course_id: course_id, created_at: {$gte: date}}, function(err, lessons){
			console.log("DDDDDDDDDDDDDDDD")
			console.log(lessons)

			lessons.forEach(function(lesson){
				data.push(lesson.name);
			});

			res.send({data: data});
		})	
	})
	
}

exports.getAllMatrix = function(req, res){
	var tutor_id = req.body.tutor_id, data=[];
	Student.find({tutor_id: tutor_id},null, {sort: 'created_at'}, function(err, students){
		if(err) return console.error(err);

		students.forEach(function(student){
			Take.find({student_id: student._id}, function(err, takes){
				if(err) return console.error(err);

				data.push({
					student_name: student.firstName + ' ' + student.lastName,
					course: takes
				})

				if(data.length == students.length){
					res.send(data);
				}
			})
		})
	})
}

exports.makePdf = function(req, res){
	var url = req.body.data,
		randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)),
		uniqid = randLetter + Date.now(),
		file_name = uniqid + '.pdf',
		pdf_path = path.join(__dirname, '..','public','pdf',file_name);

	console.log(url);
	var client = new pdf.Pdfcrowd('Pedro19880417', 'd5e42b4e5df7e4a921f52e6aefeda841');
	client.convertHtml(url, pdf.saveToFile(pdf_path));
	res.send({url: file_name});
} 


