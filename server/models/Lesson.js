// src/models/Lesson.js
var mongoose = require('mongoose');

module.exports = function() {
	var lessonSchema = mongoose.Schema({
		name: String,
		course_id: String,
		contentIds: String,	
	});

	mongoose.model('Lesson', lessonSchema);
}