// src/models/Content.js
var mongoose = require('mongoose');
// Create a schema for the Content object
module.exports = function() {
  var contentSchema = mongoose.Schema({
    videoOrQuestion: Boolean,
    videoLabel: String,
    videoEmbedCode: String,
    singleOrMulti: Boolean,
    question: String,
    answerA: String,
    answerB: String,
    answerC: String,
    trueNumber: Number,
    answer_text: String,
    lesson_id: String, 
  });

  mongoose.model('Content', contentSchema);
}