// src/models/Admin.js
var mongoose = require('mongoose'),
  encrypt = require('../utilities/encryption');

module.exports = function() {
  var adminSchema = mongoose.Schema({
    email: {type: String, required: '{PATH} is required!', unique: true},
    username: {type: String, required: '{PATH} is required!', unique: true},
    salt: {type: String, required: '{PATH} is required!'},
    hashed_pwd: {type: String, required: '{PATH} is required!'},
    roles: [String]
  });

  adminSchema.methods = {
    authenticate: function(pwdToMatch) {
      return encrypt.hashPwd(this.salt, pwdToMatch) === this.hashed_pwd;
    },
    hasRole: function(role) {
      return this.roles.indexOf(role) > -1;
    }
  };

  mongoose.model('Admin', adminSchema);
}