// src/models/Score.js
var mongoose = require('mongoose');

module.exports = function() {
	var scoreSchema = mongoose.Schema({
		student_id: String,
		lesson_id: String,
		score: Number,
	});

	mongoose.model('Score', scoreSchema);
}