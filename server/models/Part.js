// src/models/Content.js
var mongoose = require('mongoose');
// Create a schema for the Content object
module.exports = function() {
  var contentSchema = mongoose.Schema({
    slideOrQuestion: Boolean,
    label: String, // if type is true, image question type, false, fourth multiple question type
    slideContent: String,
    questionType: Number, // 0: Text, 1: Question, 2: Question with Image    
    question: String,
    answerA: String,
    answerB: String,
    answerC: String,
    answerD: String,
    image: Object,
    trueNumber: Number,
    answerText: String,
    lesson_id: String, 
    created_at: Date,
    updated_at: Date,
    order: Number
  });

  contentSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
      this.created_at = currentDate;

    next();
  });

  mongoose.model('Part', contentSchema);
}