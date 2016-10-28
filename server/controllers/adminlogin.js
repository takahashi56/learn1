// src/controllers/adminlogin.js
var mongoose = require('mongoose'),
	Admin = mongoose.model('Admin'),
	encrypt = require('../utilities/encryption');

exports.login = function(req, res) {
	res.send({data: "admin login"});
}
exports.confirmLogin = function(req, res) {
	res.send({data: "confirm Login"});
}

exports.isAdmin = function(email){
	console.log("isAdmin");
	var status = false;
	return Admin.findOne({email: email}, function(err, user){
		if(err){
			status = false;
			return console.error(err);
		}
		if(user != null){
			console.log(user);
			status = true;
			return status;
		}
	});
}

exports.authentication = function(email, pwd){
	var status = false;
	Admin.findOne({email: email}, function(err, user){
		if(err){
			console.error(err);
			status = false;
		}
		console.log(user.authenticate(pwd));
		status = user.authenticate(pwd);
	})
	console.log("controller")
	console.log(status);
	return status;
}

exports.changePassword = function(req, res){
	var admin_id = req.body.admin_id,
			pwd = req.body.pwd;

	Admin.findOne({_id: admin_id}, function(err, admin){
		if(err) res.send({success:false}).end();

		var newpwd = admin.getHashPwd(pwd.toString());
		admin.hashed_pwd = newpwd;
		admin.save();
		res.status(200).send({success: true}).end();
	})
}

exports.isValidOldPwd = function(req, res){
	var admin_id = req.body.admin_id,
			pwd = req.body.pwd;

	Admin.findOne({_id: admin_id}, function(err, admin){
		if(err) res.send({success:false}).end();

		if(admin.authenticate(pwd)){
			res.status(200).send({success: true}).end();
		}else{
			res.status(200).send({success: false}).end();
		}
	})
}

exports.addAdmin = function(req, res) {
	var admin = req.body,
		salt = encrypt.createSalt();
	admin["salt"] = salt;
	admin["hashed_pwd"] = encrypt.hashPwd(salt, admin["password"]);
	admin["created_at"] = new Date();
	admin['username'] = admin.email;
	admin["logon_date"] = '';
	
	console.log(req.body);

	Admin.create(admin, function(err, admin){
		if(err) {
			console.error(err)
			res.send(err);
		}else{
			console.log("success")
			var data = {action: "success", text: "", role: 0, success: true, _id: admin._id};
			res.send(data);
		}
	});
}

exports.editAdmin = function(req, res) {
	var admin = req.body,
		salt = encrypt.createSalt();

	console.log("#################################")
	console.log(admin)
	admin["salt"] = salt;
	admin["hashed_pwd"] = encrypt.hashPwd(salt, admin["password"]);
	admin["updated_at"] = new Date();

	Admin.update({_id: admin._id}, admin, function(err, admin){
		if(err) return console.error(err);

		res.send({success: true});
	})
}

exports.getAllAdmins = function(req, res){
	var temp={}, i=0,data = [], admin_id=req.body.admin_id;

	Admin.find({},null, {sort: 'created_at'}, function(err, results){
		results.sort(function(a, b){
			return a.firstName.localeCompare(b.firstName);
		})
		res.send(results);
	})
}

exports.removeAdmin = function(req, res) {

	var list = req.body.list;

	console.log(list);
	list.forEach(function (l) {
		console.log(l)
		Admin.findOneAndRemove({_id: mongoose.Types.ObjectId(l)}, function(err, removed){
			if(err) console.error(err);

			console.log(removed);
		})
	})

	res.send({success: true});

}
