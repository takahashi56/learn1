// src/models/Tutor.js
var mongoose = require('mongoose'),
  encrypt = require('../utilities/encryption');

module.exports = function() {
  var tutorSchema = mongoose.Schema({
    firstName: {type: String, required: '{PATH} is required!'},
    lastName: {type: String, required: '{PATH} is required!'},
    salt: {type: String, required: '{PATH} is required!'},
    hashed_pwd: {type: String, required: '{PATH} is required!'},
    organization: String,
    department: String,
    phone: String,
    email: {type: String, required: '{PATH} is required!', unique: true},
    created_at: Date,
    updated_at: Date,
    creditcount: Number,
    employeecount: Number,
    subscribing: Boolean,
    logon_date: Date,
    notes: String,
  });


  tutorSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;
    if(this.subscribing == null){
      this.subscribing = false;
    }

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
      this.created_at = currentDate;

    next();
  });

  tutorSchema.methods = {
    authenticate: function(pwdToMatch) {
      return (encrypt.hashPwd(this.salt, pwdToMatch) === this.hashed_pwd) && (this.hashed_pwd != "");
    },
    hasRole: function(role) {
      return this.roles.indexOf(role) > -1;
    },
    getHashPwd: function(password) {
      return encrypt.hashPwd(this.salt, password);
    }
  };

  mongoose.model('Tutor', tutorSchema);
}
