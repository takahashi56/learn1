// src/models/Take.js
var mongoose = require('mongoose');

module.exports = function() {
	var takeSchema = mongoose.Schema({
		student_id: String,
		course_id: String,
		score: Number,
	});

	mongoose.model('Take', takeSchema);
}