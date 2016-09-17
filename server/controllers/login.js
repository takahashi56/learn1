// src/controllers/login.js
var mongoose = require('mongoose'),
	Student = mongoose.model('Student'),
	Tutor = mongoose.model('Tutor'),
	Admin = mongoose.model('Admin'),
	adminLogin = require('./adminlogin'),
	encrypt = require('../utilities/encryption'),
	nodemailer = require('nodemailer'),
	smtpTransport = require('nodemailer-smtp-transport');


exports.login = function(req, res) {
	var email = req.body.username,
		pwd = req.body.password,
		data = {action: "not-found", text: "", role: NaN, success: false, _id: ''},
		action = 0;

	data.text = "This email is not valid. Please try again.";

	Admin.findOne({email: email}, function(err, user){
		if(user == null){
			Tutor.findOne({email: email}, function(err, tutor){
				if(tutor == null) {
					res.send(data);
					return console.error(err);
				}else{
					if(tutor.authenticate(pwd)){
						action = 2;
						data._id = tutor._id;
						data.action = "/home/tutor/main";
						data.role = 1;
						data.success = true;
						data["organization"] = tutor.organization;
						return res.send(data);
					}else{
						res.send(data);
					}
				}
			})
		}else{
			if(user.authenticate(pwd)){
				action = 1;
				data.action = "/home/admin/main";
				data._id = user._id;
				data.role = 0;
				data.success = true;
				return res.send(data);
			}else{
				return res.send(data)
			}
		}
	});

	// setTimeout(function(){
	// 	if(action != 1){
	// 		Tutor.findOne({email: email}, function(err, tutor){
	// 			if(tutor == null) {
	// 				res.send(data);
	// 				return console.error(err);
	// 			}
	// 			if(tutor.authenticate(pwd)){
	// 				action = 2;
	// 				data.action = "tutor-course";
	// 				data.role = 1;
	// 				data.success = true;
	// 				return res.send(data);
	// 			}else{
	// 				res.send(data);
	// 			}
	// 		})
	// 	}
	// }, 2000);

}

exports.studentLogin = function(req, res) {
	var userid = req.body.username,
		pwd = req.body.password,
		data = {action: "not-found", text: "This id is not valid. Please try again.", role: NaN, success: false, _id: ""};

	Student.findOne({username: userid}, function(err, student){
		if(student == null){
			res.send(data);
			return console.error(err);
		}
		if(student.authenticate(pwd)){
			data.action = "/home/student/main";
			data._id = student._id;
			data.role = 2;
			data.success = true;
			data.id = student._id;
			res.send(data)
		}else{
			res.send(data);
		}
	})
}

exports.forgetpwd = function(req, res){
	var email = req.body.email,
			data = {};

	Tutor.findOne({email: email}, function(err, tutor){
		if(tutor == null) {
			data = {fail: true};
			res.send(data);
			return console.error(err);
		}else{
			data = {success: true};
			res.send(data);
			var fullUrl = req.protocol + '://' + req.get('host'),
			smtpConfig = {
			    host: 'smtp.gmail.com',
			    port: 465,
			    secure: true, // use SSL
			    auth: {
			        user: 'jlee021199@gmail.com',
			        pass: 'newFirst100'
			    }
			},
			mailContent = 'You can set your password again. please follow this url <br/> The url is <a href="'+ fullUrl + '/#/resetpwd" >Reset the password </a> ',
			mailOptions = {
			    from: 'jlee021199@gmail.com', // sender address
			    to: 'chrisbrownapple001@gmail.com', // list of receivers
			    subject: 'Hello ✔', // Subject line
			    text: 'Hello world 🐴', // plaintext body
			    html: mailContent // html body
			}
			,transport = nodemailer.createTransport(smtpTransport({
			    service: 'gmail',
			    auth: {
			        user: 'jlee021199@gmail.com', // my mail
			        pass: 'newFirst100'
			    }
			}));
			transport.sendMail(mailOptions, function(error, info){
			    if(error){
			        return console.log(error);
			    }
			    console.log('Message sent: ' + info.response);
			});
		}
	});
}

exports.resetPwd = function(req, res){
	var password = req.body.password,
			email = req.body.email,
			data = {};
	Tutor.findOne({email: email}, function(err, tutor){
		if(err) return console.error(err);

		tutor.hashed_pwd = tutor.getHashPwd(password);
		tutor.save();

		data = {success: true};

		res.send(data);
	});

}
