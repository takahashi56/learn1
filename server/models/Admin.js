// src/models/Admin.js
var mongoose = require('mongoose'),
  encrypt = require('../utilities/encryption');

module.exports = function() {
  var adminSchema = mongoose.Schema({
    firstName:{type: String, required: '{PATH} is required!'},
    lastName:{type: String, required: '{PATH} is required!'},
    email: {type: String, required: '{PATH} is required!', unique: true},
    username: {type: String},
    salt: {type: String, required: '{PATH} is required!'},
    hashed_pwd: {type: String, required: '{PATH} is required!'},
    roles: [String],
    created_at: Date,
    updated_at: Date,
  });

  adminSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
      this.created_at = currentDate;

    next();
  });


  adminSchema.methods = {
    authenticate: function(pwdToMatch) {
      console.log(encrypt.hashPwd(this.salt, pwdToMatch))
      return encrypt.hashPwd(this.salt, pwdToMatch) == this.hashed_pwd;
    },
    hasRole: function(role) {
      return this.roles.indexOf(role) > -1;
    },
    getHashPwd: function(password) {
      return encrypt.hashPwd(this.salt, password);
    }
  };

  mongoose.model('Admin', adminSchema);
}
