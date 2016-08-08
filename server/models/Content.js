// src/models/Content.js
var mongoose = require('mongoose');
// Create a schema for the Content object
module.exports = function() {
  var contentSchema = mongoose.Schema({
    videoOrQuest: Boolean,
    url: String,
    question: String,
    question_type: Boolean,
    answer1: String,
    answer2: String,
    answer3: String,
    true_number: Number,
    answer_text: String,
    lesson_id: String, 
  });

  mongoose.model('Content', contentSchema);
}