// src/models/Student.js
var mongoose = require('mongoose'),
  encrypt = require('../utilities/encryption');

module.exports = function() {
  var transactionSchema = mongoose.Schema({
    email: {type: String, required: '{PATH} is required!'},
    tutor_id: {type: String, required: '{PATH} is required!'},
    transaction_id: {type: String, required: '{PATH} is required!', unique: true},
    created_paid: {type: String, required: '{PATH} is required!'},
    credits: Number,
    holder: String,
    created_at: Date,
    updated_at: Date,
  });

  transactionSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
      this.created_at = currentDate;

    next();
  });

  mongoose.model('StripeTransaction', transactionSchema);
}
