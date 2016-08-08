// src/models/Course.js
var mongoose = require('mongoose');

module.exports = function() {
	var courseSchema = mongoose.Schema({
		name: {type: String,required: true},
		description: String,	
	});


	mongoose.model('Course', courseSchema);
}