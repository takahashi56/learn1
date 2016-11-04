// src/controllers/tutorstudent.js
var mongoose = require('mongoose'),
    Tutor = mongoose.model('Tutor'),
    Student = mongoose.model('Student'),
    Course = mongoose.model('Course'),
    Take = mongoose.model('Take'),
    Lesson = mongoose.model('Lesson'),
    StripeTransaction = mongoose.model('StripeTransaction'),
    encrypt = require('../utilities/encryption'),
    csv = require('fast-csv'),
    pdf = require('pdfcrowd'),
    path = require('path'),
    GoCardless = require('../utilities/GoCardless_index'),
    open = require('open'),
    subscribe_data = {
        session_id: '',
        amount: 0,
        count: 0
    };

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require('../config/config')[env],
    stripe = require('stripe')(config.stripe_secret_key),
    gc_config = {
        // sandbox: false,
        sandbox: true,
        token: config.gc_access_token
    },
    goCardless = new GoCardless(gc_config);

exports.getAllStudents = function(req, res) {
    var data = req.body,
        tutor_id = data.tutor_id,
        total = 0,
        complete = 0;

    Student.find({
        tutor_id: tutor_id
    }, null, {
        sort: 'created_at'
    }, function(err, students) {
        if (err) return console.error(err)
        var students_copy = [];

        students.forEach(function(student) {
            Take.find({
                student_id: student._id
            }).lean().exec(function(err, takes) {
                complete = 0;
                total = takes.length;
                for (var i = 0, len = takes.length; i !== len; i++) {
                    if (takes[i].isCompleted) complete++;
                }

                var s = {
                    student_id: student._id,
                    username: student.username,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    DOB: student.DOB,
                    hashed_pwd: student.hashed_pwd,
                    phone: student.phone,
                    isSelected: false,
                    tutor_id: tutor_id,
                    other: complete + ' of ' + total
                };

                students_copy.push(s);
                if (students.length == students_copy.length) {
                    students_copy.sort(function(a, b) {
                        return a.firstName.localeCompare(b.firstName);
                    })
                    res.send(students_copy);
                }
            })
        });

    })
}

exports.getAllCourses = function(req, res) {
    var tutor_id = req.body.tutor_id;
    var main_data = [];
    Course.find({}, null, {
        sort: 'created_at'
    }, function(err, courses) {
        if (err) return console.error(err)


        courses.forEach(function(course) {

            Take.find({
                course_id: course._id
            }, function(err, takes) {
                if (err) return console.error(err)

                var count = 0,
                    i = 0,
                    past = 0;;
                if (takes.length == 0) {
                    i++;
                    var data1 = {
                        course_id: course._id,
                        coursetitle: course.name,
                        enrolled: 0,
                        past: 0,
                        coursedescription: course.description
                    }
                    main_data.push(data1);
                    if (main_data.length == courses.length) {
                        res.send(main_data);

                        return false;
                    }
                } else {
                    takes.forEach(function(take) {
                        Student.findOne({
                            _id: take.student_id,
                            tutor_id: tutor_id
                        }, function(err, student) {
                            if (err) return console.error(err);

                            i++;
                            if (student != null && take.score > 0) past++;
                            if (student != null && take.score == 0) count++;

                            if (i == takes.length) {
                                var data = {
                                    course_id: course._id,
                                    coursetitle: course.name,
                                    enrolled: count,
                                    past: past,
                                    coursedescription: course.description
                                }
                                main_data.push(data);
                                if (main_data.length == courses.length) {
                                    main_data.sort(function(a, b) {
                                        return a.coursetitle.localeCompare(b.coursetitle);
                                    })
                                    res.send(main_data);

                                    return false;
                                }
                            }
                        })
                    })
                }
            })
        });

    })
}

exports.addStudent = function(req, res) {
    var student = req.body;

    student["created_at"] = new Date();

    Student.create(student, function(err, student) {
        if (err) return console.error(err);

        res.send({
            success: true
        });
    })
}

exports.addStudentCSV = function(req, res) {
    var students = req.body.result,
        tutor_id = req.body.tutor_id,
        count = false,
        ii = 0,
        flag = true;

    students.forEach(function(studentcsv) {
        ii++;
        csv.fromString(studentcsv[0], {
                header: true
            })
            .on("data", function(data) {
                var student = {
                    firstName: data[0],
                    lastName: data[1],
                    DOB: data[2],
                    phone: data[3],
                    username: data[4],
                    hashed_pwd: data[5],
                    tutor_id: tutor_id,
                }

                Student.find({}, function(err, sCollection) {
                    if (err) throw err;

                    i = 0;
                    sCollection.forEach(function(s) {
                        if (s.username.includes(data[4])) i++;
                    });
                    if (i != 0) student.username = data[4] + i;
                    Student.create(student, function(err, std) {
                        if (err) return console.log(err);
                        count = true;

                        if (ii == students.length && flag == true) {
                            flag = false
                            res.send({
                                success: true
                            });

                            return false;
                        }
                    })
                })
            })
    });

    return false;
}

exports.editStudent = function(req, res) {
    var student = req.body;

    Student.update({
        _id: student._id
    }, student, function(err, student) {
        if (err) return console.error(err);

        res.send({
            success: true
        });
    })
}

exports.deleteStudent = function(req, res) {
    res.send({
        data: "add Tutor"
    });
}

exports.setStudentByCourse = function(req, res) {
    var course_id = req.body.course_id,
        students_ids = req.body.ids,
        tutor_id = req.body.tutor_id;

    Tutor.findOne({
        _id: tutor_id
    }, function(err, tutor) {
        if (tutor.creditcount == 0) {
            res.send(500).send({
                error: "you cannot assign the course to students!"
            }).end();
        }
        var creditcount = tutor.creditcount, i = 0;

        students_ids.map(function(id) {
          Take.find({
            student_id: id
          }, function(err, takes) {
            if (err) return console.log(err);

            var confirm = takes.filter(function(x) {
              return x.course_id == course_id
            });

            i++;
            console.log('confirm = ' + JSON.stringify(confirm));

            if (confirm.length == 0) {
              var data = {
                student_id: id,
                course_id: course_id,
                score: 0,
                isCompleted: false,
                completedAt: '',
                certificate: ''
              }
              if(tutor.subscribing == false){
                creditcount--;
                if(creditcount < 0){
                  tutor.creditcount = 0;
                  tutor.save();
                  res.send({
                    success: true,
                    creditcount: 0
                  }).end();
                  return console.error("creditcount = 0");

                }else{
                  tutor.creditcount = creditcount;
                  tutor.save();
                }
              }

              Take.create(data, function(err, take) {
                if (err) return console.log(err);
              });
            }

            if(i == student_ids.length){
              res.send({success: true, creditcount: creditcount});
              return;
            }
          })
        })
    });
}



exports.getCoursesByStudentId = function(req, res) {
    var id = req.body.student_id,
        tutor_id = req.body.tutor_id;

    Take.find({
        student_id: id
    }, null, {
        sort: 'created_at'
    }, function(err, takes) {
        if (err) return console.log(err);
        var courses = [];
        var count = 0,
            i = 0;

        takes.forEach(function(take) {
            Course.findOne({
                _id: take.course_id
            }, function(err, course) {
                if (err) return console.error(err);

                if (course == null) {
                    take.remove();
                }
                i++;
                if (course != null) {
                    var data = {
                        course_id: course._id,
                        coursetitle: course.name,
                        isCompleted: take.isCompleted,
                        score: take.score,
                        completedAt: take.completedAt,
                        certificate: take.certificate,
                    }
                    courses.push(data);
                }
                if (i == takes.length) {
                    courses.sort(function(a, b) {
                        return a.coursetitle.localeCompare(b.coursetitle);
                    })
                    res.send(courses);
                }
            })
        })
    })
}

exports.getStudentsByCourseId = function(req, res) {
    var id = req.body.course_id,
        tutor_id = req.body.tutor_id;

    // Take.find({course_id: id}, function(err, takes){
    // 	if(err) return console.log(err);
    // 	var courses = [];

    // 	takes.forEach(function(take){
    // 		Student.findOne({_id: take.student_id, tutor_id: tutor_id}, function(err, student){
    // 			if(err) return console.error(err);

    // 			if(student != null){
    // 				var data = {
    // 					firstName: student.firstName,
    // 					lastName: student.lastName,
    // 					isCompleted: take.isCompleted,
    // 					score: take.score,
    // 					completedAt: take.completedAt,
    // 					certificate: take.certificate,
    // 				}
    // 				courses.push(data);

    // 				if(courses.length == takes.length){
    // 					res.send(courses);
    // 				}
    // 			}
    // 		})
    // 	})
    // })


    Take.find({
        course_id: id
    }, null, {
        sort: 'created_at'
    }, function(err, takes) {
        if (err) return console.error(err)
        var courses = [];

        var count = 0,
            i = 0;
        takes.forEach(function(take) {
            Student.findOne({
                _id: take.student_id,
                tutor_id: tutor_id
            }, function(err, student) {
                if (err) return console.error(err);
                i++;

                if (student != null) {
                    var data = {
                        student_id: student._id,
                        firstName: student.firstName,
                        lastName: student.lastName,
                        isCompleted: take.isCompleted,
                        score: take.score,
                        completedAt: take.completedAt,
                        certificate: take.certificate,
                    }
                    courses.push(data);
                }
                if (i == takes.length) {
                    courses.sort(function(a, b) {
                        return a.firstName.localeCompare(b.firstName);
                    })
                    res.send(courses);
                }
            })
        })
    })
}


exports.removeStudent = function(req, res) {
    var list = req.body.list;
    list.forEach(function(id) {
        Student.findOne({
            _id: id
        }, function(err, student) {
            if (err) console.error(err);

            Take.find({
              student_id: student._id
            }, function(err, takes){
              takes.forEach(function(take){
                take.remove();
              })
              student.remove()
            });
        })
    })

    res.send({
        success: true
    });
}

exports.getLessonsNameByCourseId = function(req, res) {
    var course_id = req.body.course_id,
        data = [],
        date;
    Course.findOne({
        _id: course_id
    }, function(err, course) {
        if (course.created_at == null) {
            date = course.updated_at;
        } else {
            date = course.created_at;
        }
        Lesson.find({
            course_id: course_id,
            created_at: {
                $gte: date
            }
        }, function(err, lessons) {

            lessons.forEach(function(lesson) {
                data.push(lesson.name);
            });

            res.send({
                data: data
            });
        })
    })

}

exports.getAllMatrix = function(req, res) {
    var tutor_id = req.body.tutor_id,
        data = [];
    Student.find({
        tutor_id: tutor_id
    }, null, {
        sort: 'created_at'
    }, function(err, students) {
        if (err) return console.error(err);

        students.forEach(function(student) {
            Take.find({
                student_id: student._id
            }, function(err, takes) {
                if (err) return console.error(err);

                data.push({
                    student_name: student.firstName + ' ' + student.lastName,
                    course: takes
                })

                if (data.length == students.length) {
                    data.sort(function(a, b) {
                        return a.student_name.localeCompare(b.student_name);
                    })
                    res.send(data);
                }
            })
        })
    })
}

exports.getAllUnCompleted = function(req, res) {
    var tutor_id = req.body.tutor_id,
        data = [];

    Student.find({
        tutor_id: tutor_id
    }, null, {
        sort: 'created_at'
    }, function(err, students) {
        if (err) return console.error(err);

        students.forEach(function(student) {
            Take.find({
                student_id: student._id
            }, function(err, takes) {
                if (err) return console.error(err);

                data.push({
                    student_name: student.firstName + ' ' + student.lastName,
                    course: takes
                })

                if (data.length == students.length) {
                    data.sort(function(a, b) {
                        return a.student_name.localeCompare(b.student_name);
                    })
                    res.send(data);
                }
            })
        })
    })
}

exports.makePdf = function(req, res) {
    var url = req.body.data,
        direction = req.body.direction,
        randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)),
        uniqid = randLetter + Date.now(),
        file_name = uniqid + '.pdf',
        pdf_path = path.join(__dirname, '..', 'public', 'pdf', file_name);

    var client = new pdf.Pdfcrowd('ChrisBrownApple', '788e02237e2e8a610a77c3a8544248fc');
    if (direction == true) {
        client.convertHtml(url, pdf.saveToFile(pdf_path));
    } else {
        client.convertHtml(url, pdf.saveToFile(pdf_path), {
            width: "12.692in",
            height: "7.267in",
            vmargin: ".2in",
            footer_html: ''
        });
    }

    res.send({
        url: file_name
    });
}

exports.changePassword = function(req, res) {
    var tutor_id = req.body.tutor_id,
        pwd = req.body.pwd;

    Tutor.findOne({
        _id: tutor_id
    }, function(err, tutor) {

        if (err) {
            res.send({
                success: false
            }).end();
        } else {
            var newpwd = tutor.getHashPwd(pwd.toString());
            tutor.hashed_pwd = newpwd;
            tutor.save();
            res.status(200).send({
                success: true
            }).end();
        }
    })
}

exports.isValidOldPwd = function(req, res) {
    var tutor_id = req.body.tutor_id,
        pwd = req.body.pwd;

    Tutor.findOne({
        _id: tutor_id
    }, function(err, tutor) {
        if (err) res.send({
            success: false
        }).end();
        if (tutor.authenticate(pwd)) {
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


exports.performPayment = function(req, res) {
    var tutor_id = req.body.tutor_id,
        token_id = req.body.id,
        email = req.body.form.email,
        holder = req.body.form.holder,
        amount = req.body.form.amount,
        number = req.body.form.card_number,
        cvv = req.body.form.card_cvv,
        month = req.body.form.expire_month,
        year = req.body.form.expire_year,
        creditcount = req.body.creditcount;

    stripe.tokens.create({
        card: {
            "number": number,
            "exp_month": month,
            "exp_year": year,
            "cvc": cvv,
            "name": email
        }
    }, function(err, token) {
        if (err) {
            console.error(err);
            res.status(500).send({
                flag: false,
                data: null
            }).end();
            return;
        }
        stripe.charges.create({
            amount: amount * 100 * 4,
            currency: 'gbp',
            source: token.id
        }, function(err, charge) {
            if (err && err.type === 'StripeCardError') {
                // card decline
                console.log(err);
                res.status(500).send({
                    flag: false,
                    data: null
                }).end();
            } else {
                if (charge.status == 'succeeded' && charge.paid == true) {
                    var credits = Number(charge.amount / 100) + Number(creditcount),
                        created = new Date(charge.created),
                        transaction_id = charge.id,
                        transaction = new StripeTransaction();

                    transaction.credits = charge.amount / 100;
                    transaction.email = email;
                    transaction.created_paid = created,
                        transaction.transaction_id = transaction_id;
                    transaction.holder = holder;
                    transaction.tutor_id = tutor_id;

                    transaction.save();

                    Tutor.findOne({
                        _id: tutor_id
                    }, function(err, tutor) {
                        tutor.creditcount = credits;
                        tutor.save();

                        res.status(200).send({
                            flag: true,
                            data: {
                                creditcount: credits,
                                trans: transaction
                            }
                        }).end();
                    })
                }
            }
        })
    });
}

exports.getGoCardlessRedirectUrl = function(req, res) {
    var tutor_id = req.body.tutor_id,
        description = '',
        sessionToken = tutor_id,
        successUrl = req.protocol + '://' + req.get('host') + '/api/tutor/getGoCardlessCompleteUrl';

    console.log(goCardless);

    goCardless.startRedirectFlow(description, sessionToken, successUrl)
        .then(function(response) {
            subscribe_data.amount = req.body.amount * 100;
            subscribe_data.count = req.body.count;
            subscribe_data.session_id = tutor_id;

            res.send({
                redirect_url: response.redirect_flows.redirect_url
            }).end();
        })
}

exports.getGoCardlessCompleteUrl = function(req, response) {
    var redirect_flow_id = req.query.redirect_flow_id;

    goCardless.completeRedirectFlow(redirect_flow_id, subscribe_data.session_id)
        .then(function(res) {
            var creditor = res.redirect_flows.links.creditor,
                mandate = res.redirect_flows.links.mandate,
                customer = res.redirect_flows.links.customer,
                customer_bank_account = res.redirect_flows.links.customer_bank_account,
                day_of_month = (new Date()).getDay() >= 28 ? 28 : (new Date()).getDay();

            goCardless.subscriptions(mandate, subscribe_data.amount, 'GBP', null, null, null, null, 'monthly', day_of_month, null)
                .then(function(charge) {
                    if (charge.body.subscriptions.status == 'active') {
                        Tutor.findOne({
                            _id: subscribe_data.session_id
                        }, function(err, tutor) {
                            tutor.subscribing = true;
                            tutor.employeecount = subscribe_data.count;
                            tutor.save();
                            response.redirect(req.protocol + '://' + req.get('host') + '/#/home/tutor/main/gocardless/success');
                        })
                    } else {
                        response.redirect(req.protocol + '://' + req.get('host') + '/#/home/tutor/main/gocardless/fail');
                    }
                })


        })
}

exports.getStripeHistory = function(req, res) {
    var tutor_id = req.body.tutor_id;

    StripeTransaction.find({
        tutor_id: tutor_id
    }, function(err, trans) {
      trans.sort(function(a, b) {
          return new Date(b.created_at) - new Date(a.created_at);
      })
        res.status(200).send(trans).end();
    })
}

exports.getTutorInfo = function(req, res) {
    var tutor_id = req.body.tutor_id;

    Tutor.findOne({
        _id: tutor_id
    }, function(err, tutor) {
        res.send(tutor).end();
    })
}


exports.unassign = function(req, res){
  var course_id = req.body.course_id,
      student_ids = req.body.student_ids,
      tutor_id = req.body.tutor_id,
      creditcount = req.body.creditcount;

  student_ids.forEach(function(id){
    Take.findOne({
      course_id: course_id,
      student_id: id
    }, function(err, take) {
        if (err) return console.log(err);

        take.remove();
    });
  })

  Tutor.findOne({_id: tutor_id},function(err, tutor){
    tutor.creditcount = Number(creditcount) + student_ids.length;

    tutor.save();
    res.send({sucess: true, creditcount: tutor.creditcount}).end();
  })

}
