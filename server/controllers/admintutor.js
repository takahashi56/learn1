// src/controllers/admintutor.js
var mongoose = require('mongoose'),
    Admin = mongoose.model('Admin'),
    Tutor = mongoose.model('Tutor'),
    Student = mongoose.model('Student'),
    encrypt = require('../utilities/encryption'),
    _ = require('lodash');

exports.getAllTutors = function(req, res) {
    var temp = {},
        i = 0,
        data = [];

    Tutor.find({}, null, {
        sort: 'created_at'
    }, function(err, results) {
        results.forEach(function(tutor) {
            Student.count({
                tutor_id: tutor._id
            }, function(err, count) {
                i += 1;
                temp = {
                    id: tutor._id,
                    organization: tutor.organization,
                    firstName: tutor.firstName,
                    lastName: tutor.lastName,
                    phone: tutor.phone,
                    email: tutor.email,
                    student: count,
                    department: tutor.department,
                    lastlogon: tutor.logon_date, //.toString().slice(0,10).replace(/-/g,""),
                    notes: tutor.notes
                }

                data.push(temp);

                if (i == results.length) {
                    data.sort(function(a, b) {
                        return a.organization.localeCompare(b.organization);
                    })
                    res.send(data)
                }
            })
        })

    })
}

exports.addTutor = function(req, res) {
    var tutor = req.body,
        salt = encrypt.createSalt();
    tutor["salt"] = salt;
    tutor["hashed_pwd"] = encrypt.hashPwd(salt, tutor["password"]);
    tutor["created_at"] = new Date();
    tutor.email = tutor.email.toLowerCase()

    Admin.findOne({
      email: tutor.email.toLowerCase()
    }, function(err, admin){
      if(err) console.log(err);
      if(_.isEmpty(admin) || _.isNil(admin)) {
        Tutor.create(tutor, function(err, tutor) {
          if (err) {
            res.send(err);
          } else {
            var data = {
              action: "success",
              text: "",
              role: 1,
              success: true,
              _id: tutor._id
            };
            res.send(data);
          }
        })
      }else{
        var data = {
          action: "fail",
          text: "This email was already used for another user. please use other email.",
          role: 1,
          success: false,
          _id: null,
        };
        res.send(data);
      }
    })


}

exports.editTutor = function(req, res) {
    var tutor = req.body,
        salt = encrypt.createSalt();
		console.log(tutor);

    if (tutor['password'] != null) {
        tutor["salt"] = salt;
        tutor["hashed_pwd"] = encrypt.hashPwd(salt, tutor["password"]);
    }

    tutor["updated_at"] = new Date();
    tutor.email = tutor.email.toLowerCase()

    Tutor.update({
        _id: tutor._id
    }, tutor, function(err, tutor) {
        if (err)
            return console.error(err);

        res.send({success: true});
    })
}
exports.deleteTutor = function(req, res) {

    var list = req.body.list;

    list.forEach(function(l) {
        Tutor.findOneAndRemove({
            _id: mongoose.Types.ObjectId(l)
        }, function(err, removed) {
            if (err)
                console.error(err);

            }
        )
    })

    res.send({success: true});

}
