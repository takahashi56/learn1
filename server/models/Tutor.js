// src/models/Tutor.js
var mongoose = require('mongoose'),
  encrypt = require('../utilities/encryption');

module.exports = function() {
  var tutorSchema = mongoose.Schema({
    firstname: {type: String, required: '{PATH} is required!'},
    lastname: {type: String, required: '{PATH} is required!'},
    salt: {type: String, required: '{PATH} is required!'},
    hashed_pwd: {type: String, required: '{PATH} is required!'},
    organization: String,
    department: String, 
    phone: String,
    email: {type: String, required: '{PATH} is required!', unique: true},
    created_at: Date,
    updated_at: Date,
  });

  tutorSchema.methods = {
    authenticate: function(pwdToMatch) {
      return (encrypt.hashPwd(this.salt, pwdToMatch) === this.hashed_pwd) && (this.hashed_pwd != "");
    },
    hasRole: function(role) {
      return this.roles.indexOf(role) > -1;
    }
  };

  mongoose.model('Tutor', tutorSchema);
}