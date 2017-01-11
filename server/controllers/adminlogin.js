// src/controllers/adminlogin.js
var mongoose = require('mongoose'),
    Admin = mongoose.model('Admin'),
    Tutor = mongoose.model('Tutor'),
    _ = require('lodash'),
    encrypt = require('../utilities/encryption');

exports.login = function (req, res) {
    res.send({
        data: "admin login"
    });
}
exports.confirmLogin = function (req, res) {
    res.send({
        data: "confirm Login"
    });
}

exports.isAdmin = function (email) {
    var status = false;
    return Admin.findOne({
        email: email
    }, function (err, user) {
        if (err) {
            status = false;
            return console.error(err);
        }
        if (user != null) {
            status = true;
            return status;
        }
    });
}

exports.authentication = function (email, pwd) {
    var status = false;
    email = email.toLowerCase();

    Admin.findOne({
        email: email
    }, function (err, user) {
        if (err) {
            console.error(err);
            status = false;
        }
        status = user.authenticate(pwd);
    })
    return status;
}

exports.changePassword = function (req, res) {
    var admin_id = req.body.admin_id,
        pwd = req.body.pwd;

    Admin.findOne({
        _id: admin_id
    }, function (err, admin) {
        if (err)
            res.send({
                success: false
            }).end();

        var newpwd = admin.getHashPwd(pwd.toString());
        admin.hashed_pwd = newpwd;
        admin.save();
        res.status(200).send({
            success: true
        }).end();
    })
}

exports.isValidOldPwd = function (req, res) {
    var admin_id = req.body.admin_id,
        pwd = req.body.pwd;

    Admin.findOne({
        _id: admin_id
    }, function (err, admin) {
        if (err)
            res.send({
                success: false
            }).end();

        if (admin.authenticate(pwd)) {
            res.status(200).send({
                success: true
            }).end();
        } else {
            res.status(200).send({
                success: false
            }).end();
        }
    })
}

exports.addAdmin = function (req, res) {
    var admin = req.body,
        salt = encrypt.createSalt();
    admin["salt"] = salt;
    admin["hashed_pwd"] = encrypt.hashPwd(salt, admin["password"]);
    admin["created_at"] = new Date();
    admin['username'] = admin.email;
    admin["logon_date"] = '';
    admin.email = admin.email.toLowerCase()

    Tutor.findOne({
        email: admin.email
    }, function (err, tutor) {
        if (err) console.log(err)
        if (_.isEmpty(tutor) || _.isNil(tutor)) {
            Admin.create(admin, function (err, admin) {
                if (err) {
                    console.log(err)
                    res.send({
                        sucess: false,
                        error: err
                    });
                } else {
                    var data = {
                        action: "success",
                        text: "",
                        role: 0,
                        success: true,
                        _id: admin._id
                    };
                    res.send(data);
                }
            });
        } else {
            res.send({
                sucess: false,
                error: ''
            });
        }
    })
}

exports.editAdmin = function (req, res) {
    var admin = req.body,
        salt = encrypt.createSalt();

    console.log(admin);

    if (admin['password'] != '') {
        admin["salt"] = salt;
        admin["hashed_pwd"] = encrypt.hashPwd(salt, admin["password"]);
    }
    admin.email = admin.email.toLowerCase()
    admin["updated_at"] = new Date();

    Admin.update({
        _id: admin._id
    }, admin, function (err, admin) {
        if (err) {
            console.log(err)
            res.send({
                sucess: false,
                error: err
            });
        } else {
            res.send({
                success: true
            });
        }

    })
}

exports.getAllAdmins = function (req, res) {
    var temp = {},
        i = 0,
        data = [],
        admin_id = req.body.admin_id;

    Admin.find({}, null, {
        sort: 'created_at'
    }, function (err, results) {
        results.sort(function (a, b) {
            return a.firstName.localeCompare(b.firstName);
        })
        res.send(results);
    })
}

exports.removeAdmin = function (req, res) {

    var list = req.body.list;

    list.forEach(function (l) {
        Admin.findOneAndRemove({
            _id: mongoose.Types.ObjectId(l)
        }, function (err, removed) {
            if (err)
                console.error(err);

        })
    })

    res.send({
        success: true
    });

}