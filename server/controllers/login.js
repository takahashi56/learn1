// src/controllers/login.js
var mongoose = require('mongoose'),
	Student = mongoose.model('Student'),
	Tutor = mongoose.model('Tutor'),
	Take = mongoose.model('Take'),
	Admin = mongoose.model('Admin'),
	adminLogin = require('./adminlogin'),
	encrypt = require('../utilities/encryption'),
	nodemailer = require('nodemailer'),
	smtpTransport = require('nodemailer-smtp-transport'),
	postmark = require('postmark');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
		config = require('../config/config')[env],
		client = new postmark.Client(config.postmark_api);

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
						data["creditcount"] = tutor.creditcount;
						data["employeecount"] = tutor.employeecount;
						data["name"] = tutor.firstName + " " + tutor.lastName;
						data["stripe_publish_key"] = config.stripe_publish_key;
						return res.send(data);
					}else{
						res.send(data);
					}
				}
			})
		}else{
			if(user.authenticate(pwd)){
				user.logon_date = Date.now();
				user.save();

				action = 1;
				data.action = "/home/admin/main";
				data._id = user._id;
				data.role = 0;
				data.success = true;
				data["name"] = user.firstName + " " + user.lastName;
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
		data = {action: "not-found", text: "This id is not valid. Please try again.", role: NaN, success: false, _id: "", count: 0};

	Student.findOne({username: userid}, function(err, student){
		if(student == null){
			res.send(data);
			return console.error(err);
		}
		if(student.authenticate(pwd)){
			Take.count({student_id: student._id}, function(err, count){
				data.action = "/home/student/main";
				data._id = student._id;
				data.role = 2;
				data.success = true;
				data.id = student._id;
				data.count = count;
				data["name"] = student.firstName + " " + student.lastName;
				res.send(data).end();
			})
		}else{
			res.send(data);
		}
	})
}


var sendEmail = function(req, res){
	var fullUrl = req.protocol + '://' + req.get('host'),
			email = req.body.email,
			api_key = randomString(30),
			mailContent = '<html><body>To reset your password, please click the link below. <br/> <a href="'+ fullUrl + '/#/resetpwd?api_key='+ api_key +'" >Reset Correct Care password </a> <br/> <br/> If you did not request to reset your password, please ignore this email and your account will not be affected.</body></html> ';

	client.sendEmail({
		"From": "admin@correctcare.co.uk",
		"To": email,
		"Subject": "Correct Care Password Reset",
		"TextBody": '',
		"HtmlBody": mailContent
	}, function(error, success) {
			if(error) {
					console.error("Unable to send via postmark: " + error.message);
					res.status(500).send({success: false}).end()
					return;
			}else{
				console.info("Sent to postmark for delivery")
				res.status(200).send({success: true}).end()
			}
	});
}

exports.forgetpwd = function(req, res){
	var email = req.body.email,
			data = {};

	Tutor.findOne({email: email}, function(err, tutor){
		if(tutor == null) {

			Admin.findOne({email: email}, function(err, admin){
				if(err || admin == null){
					data = {success: true};
					res.send(data);
					return console.error(err);
				}else{
					sendEmail(req, res);
				}
			})
		}else{
			sendEmail(req, res);
		}
	});
}


exports.resetPwd = function(req, res){
	var password = req.body.password,
			email = req.body.email,
			data = {};
	Tutor.findOne({email: email}, function(err, tutor){
		if(err) return console.error(err);
		if(tutor == null){
				Admin.findOne({email: email}, function(err, admin){
					if(err) return console.error(err);

					admin.hashed_pwd = admin.getHashPwd(password);
					admin.save();
					data = {success: true};
					res.send(data).end();
					return;
				});
		}else{
			tutor.hashed_pwd = tutor.getHashPwd(password);
			tutor.save();

			data = {success: true};
			res.send(data).end();
		}
	});

}

function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
    	var randomPoz = Math.floor(Math.random() * charSet.length);
    	randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}
