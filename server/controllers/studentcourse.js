// src/controllers/studentcourse.js
var mongoose = require('mongoose'),
  Student = mongoose.model('Student'),
  Take = mongoose.model('Take'),
  Score = mongoose.model('Score'),
  Lesson = mongoose.model('Lesson'),
  Course = mongoose.model('Course'),
  Content = mongoose.model('Content'),  
  encrypt = require('../utilities/encryption');

exports.getAllCourse = function(req, res) {
  res.send({data: "add Tutor"});
}
exports.getAllLessonByCourse = function(req, res) {
  res.send({data: "add Tutor"});
}

exports.getAllContentByLesson = function(req, res) {
  res.send({data: "add Tutor"});
}
exports.postLesson = function(req, res) {
  res.send({data: "add Tutor"});
}
exports.viewCertificate = function(req, res) {
  res.send({data: "add Tutor"});
}
