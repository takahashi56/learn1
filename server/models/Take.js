// src/models/Take.js
var mongoose = require('mongoose');

module.exports = function() {
	var takeSchema = mongoose.Schema({
		student_id: String,
		course_id: String,
		score: Number,
		isCompleted: Boolean,
		completedAt: Date,
		certificate: String,
	});

	mongoose.model('Take', takeSchema);
}