// src/controllers/studentcourse.js
var mongoose = require('mongoose'),
  Student = mongoose.model('Student'),
  Take = mongoose.model('Take'),
  Score = mongoose.model('Score'),
  Lesson = mongoose.model('Lesson'),
  Course = mongoose.model('Course'),
  Content = mongoose.model('Content'),  
  encrypt = require('../utilities/encryption');

exports.getCourseList = function(req, res) {
  var student_id = req.body.student_id,
      courses = [];

  Take.find({student_id: student_id}, function(err, takes){
    
    takes.forEach(function (take) {
      Course.findOne({_id: take.course_id}, function(err, course){
        if(err) return console.error(err);

        console.log(course)
        var data = {
          course_id: course._id,
          coursetitle: course.name,
          coursedescription: course.description,
          score: take.score,
          isCompleted: take.isCompleted,
          completedAt: take.completedAt,
        }
        courses.push(data);

        if(takes.length == courses.length){
          res.send(courses);
        }
      })
    });
  })
}
exports.getStudentInfo = function(req, res) {
  var student_id = req.body.student_id;
  Student.findOne({_id: student_id}, function(err, student){
    if(err) return console.log(err);

    res.send(student);
  })
}

exports.getLessonList = function(req, res) {
  var student_id = req.body.student_id,
      course_id = req.body.course_id,
      return_data = [];
  console.log("course id" + course_id);
  console.log("student id" + student_id);

  Lesson.find({course_id: course_id}, function(err, lessons){
    lessons.forEach(function(lesson){
      Score.findOne({lesson_id: lesson._id}, function(err, score){
        if(err) return console.log(err);

        Content.count({lesson_id: lesson._id, videoOrQuestion: true}, function(err, content_count){
            var data = {
              lesson_id: lesson._id,
              lessonname: lesson.name,
              lessondescription: lesson.description,
              isCompleted: false,
              completedAt: '',
              score: 0,
              lock: false,
              count: content_count,
            }

            if(score){
              data.isCompleted = score.isCompleted;
              data.completedAt = score.completedAt;
              data.score = score.score;
              data.lock = true;
            }

            return_data.push(data);

            if(lessons.length == return_data.length){
              res.send(return_data);
            }
          })
      })
    })
  })    
}


exports.getContentsList = function(req, res){
  var lesson_id = req.body.lesson_id;

  Content.find({lesson_id: lesson_id}, function(err, contents){
    if(err) return console.error(err);

    res.send(contents);
  })
}
