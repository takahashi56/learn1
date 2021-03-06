// src/controllers/studentcourse.js
var mongoose = require('mongoose'),
    Student = mongoose.model('Student'),
    Take = mongoose.model('Take'),
    Score = mongoose.model('Score'),
    Tutor = mongoose.model('Tutor'),
    Lesson = mongoose.model('Lesson'),
    Course = mongoose.model('Course'),
    Content = mongoose.model('Content'),
    Part = mongoose.model('Part'),
    postmark = require('postmark'),
    encrypt = require('../utilities/encryption');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require('../config/config')[env],
    client = new postmark.Client(config.postmark_api);

exports.getCourseList = function(req, res) {
    var student_id = req.body.student_id,
        courses = [];
    var i = 0;

    Take.find({
        student_id: student_id,
        already: false
    }, null, {
        sort: 'created_at'
    }, function(err, takes) {

        takes.forEach(function(take) {
            Course.findOne({
                _id: take.course_id
            }, function(err, course) {
                if (err) return console.error(err);

                i++;
                if (course != null) {
                    var data = {
                        course_id: course._id,
                        coursetitle: course.name,
                        coursedescription: course.description,
                        score: take.score,
                        progress: take.progress == null ? 0 : take.progress,
                        isCompleted: take.isCompleted,
                        completedAt: take.completedAt,
                    }
                    courses.push(data);
                }

                if (takes.length == i) {
                    var completeArray = [],
                        unCompleteArray = [];

                    courses.forEach(function(course) {
                        if (course.isCompleted) {
                            completeArray.push(course);
                        } else {
                            unCompleteArray.push(course)
                        }
                    });

                    completeArray.sort(function(a, b) {
                        return a.coursetitle.localeCompare(b.coursetitle);
                    })

                    unCompleteArray.sort(function(a, b) {
                        return a.coursetitle.localeCompare(b.coursetitle);
                    })

                    courses = unCompleteArray.concat(completeArray);
                    res.send(courses);
                }
            })
        });
    })
}
exports.getStudentInfo = function(req, res) {
    var student_id = req.body.student_id;
    Student.findOne({
        _id: student_id
    }, function(err, student) {
        if (err) return console.log(err);

        res.send(student);
    })
}


exports.getScoreList = function(req, res) {
    var student_id = req.body.student_id,
        course_id = req.body.course_id,
        return_data = [];
    Lesson.find({
        course_id: course_id
    }, null, {
        sort: 'created_at'
    }, function(err, lessons) {
        var i = 0;
        lessons.forEach(function(lesson) {
            Score.findOne({
                lesson_id: lesson._id,
                student_id: student_id
            }, function(err, score) {
                i++;
                if (score != null) {
                    var data = {
                        lesson_id: score.lesson_id,
                        score: score.score
                    }
                    return_data.push(data);
                }
                if (i == lessons.length) {
                    res.send(return_data);
                }
            })
        })
    })
}

exports.getLessonList = function(req, res) {
    var student_id = req.body.student_id,
        course_id = req.body.course_id,
        return_data = [];

    Lesson.find({
        course_id: course_id
    }, null, {
        sort: 'created_at'
    }, function(err, lessons) {
        lessons.forEach(function(lesson) {
            Score.findOne({
                lesson_id: lesson._id,
                student_id: student_id
            }, function(err, score) {
                if (err) return console.log(err);

                Part.count({
                    lesson_id: lesson._id,
                    videoOrQuestion: false
                }, function(err, content_count) {
                    var data = {
                        lesson_id: lesson._id,
                        lessonname: lesson.name,
                        lessondescription: lesson.description,
                        isCompleted: false,
                        completedAt: '',
                        score: Number(-1),
                        lock: false,
                        count: content_count,
                        created_at: lesson.created_at
                    }

                    if (score) {
                        data.isCompleted = score.isCompleted;
                        data.completedAt = score.completedAt == null ? '' : score.completedAt;
                        data.score = score.score;
                        // data.lock = true;
                    }

                    return_data.push(data);

                    if (lessons.length == return_data.length) {
                        return_data.sort(function(a, b) {
                            return new Date(a.created_at) - new Date(b.created_at);
                        })

                        var one = true;
                        return_data.forEach(function(part, index, theArray) {
                            if (Number(theArray[index].score) == Number(-1) && one == true) {
                                theArray[index].lock = true;
                                one = false;
                            }
                        });
                        res.send(return_data);
                    }
                })
            })
        })
    })
}


exports.getContentsList = function(req, res) {
    var lesson_id = req.body.lesson_id;

    Part.find({
        lesson_id: lesson_id
    }, null, {
        sort: 'order'
    }, function(err, contents) {
        if (err) return console.error(err);

        res.send(contents);
    })
}

exports.setScoreForLesson = function(req, res) {

    var score = parseInt(req.body.score),
        lesson_id = req.body.lesson_id,
        student_id = req.body.student_id,
        isCompleted = score >= 0 ? true : false,
        completedAt = new Date(),
        certificate = '',
        data = {
            score: score,
            lesson_id: lesson_id,
            student_id: student_id,
            isCompleted: isCompleted,
            completedAt: completedAt,
            certificate: certificate
        };

    Score.findOneAndUpdate({
        lesson_id: lesson_id,
        student_id: student_id
    }, data, {
        upsert: true
    }, function(err, s) {
        if (err) return console.error(err);

        return res.send({
            sucess: true
        });
    });
}

var getDateTime = function(dateString) {
    Number.prototype.padLeft = function(base, chr) {
        var len = (String(base || 10).length - String(this).length) + 1;
        return len > 0 ? new Array(len).join(chr || '0') + this : this;
    }
    var d = new Date(dateString),
        dformat = [d.getHours().padLeft(),
            d.getMinutes().padLeft()
        ].join(':') +
        ' ' + [(d.getMonth() + 1).padLeft(),
            d.getDate().padLeft(),
            d.getFullYear() - 2000
        ].join('/');

    return dformat;
}

var sendEmail = function(req, res) {
    var score = req.body.score,
        email = req.body.email,
        completedAt = req.body.completedAt,
        coursename = req.body.coursename,
        name = req.body.name,
        subject = "Correct Care " + name + " has completed " + coursename + " course",
        mailContent = '<html><body> ' + name + ' has completed ' + coursename + ' at ' + getDateTime(completedAt) + ' and scored ' + score + '%. <br/><br/> For your records, a copy of their certificate is attached to this email. <br/><br/> Thank you. </body></html> ';

    client.sendEmail({
        "From": "admin@correctcare.co.uk",
        "To": email,
        "Subject": subject,
        "TextBody": '',
        "HtmlBody": mailContent
    }, function(error, success) {
        if (error) {
            console.error("Unable to send via postmark: " + error.message);
            return;
        } else {
            console.info("Sent to postmark for delivery")
        }
    });
}

exports.setCourseScoreWithStudent = function(req, res) {
    var score = parseInt(req.body.score),
        course_id = req.body.course_id,
        student_id = req.body.student_id,
        progress = req.body.progress,
        isCompleted = req.body.isCompleted,
        completedAt = new Date(),
        certificate = '',
        data = {
            score: score,
            course_id: course_id,
            student_id: student_id,
            isCompleted: isCompleted,
            completedAt: completedAt,
            certificate: certificate,
            progress: progress
        };

    Take.findOne({
        course_id: course_id,
        student_id: student_id,
        already: false
    }, function(err, take) {
        if (err) return console.error(err);

        if (take != null) {
            take.score = score;
            take.isCompleted = isCompleted;
            take.completedAt = completedAt;
            take.progress = progress;

            take.save(function(err, saved) {
                if (err) {
                    res.send(err).end();
                }else{
                  res.status(200).send({
                    sucess: true
                  }).end();
                }
            });

        }
    })

    if (isCompleted == true) {
        Student.findOne({
            _id: student_id
        }, function(err, student) {
            Tutor.findOne({
                _id: student.tutor_id
            }, function(err, tutor) {
                Course.findOne({
                    _id: course_id
                }, function(err, course) {
                    var data = {
                        body: {
                            score: score,
                            completedAt: completedAt,
                            email: tutor.email,
                            name: student.firstName + " " + student.lastName,
                            coursename: course.name
                        }
                    }

                    sendEmail(data, res);
                })
            })
        })
    }
    // Take.findOneAndUpdate({course_id: course_id, student_id: student_id}, data, {upsert: true}, function(err, s){
    //   if(err) return console.error(err);

    //   return
    // });
}

exports.updateScore = function(req, res) {
    var student_id = req.body.student_id;
    scoreUpdate(student_id);
    res.send({
        success: true
    });
}

var scoreUpdate = function(student_id) {

    var courseScore = 0;
    Course.find({
        draftOrLive: true,
        student_id: student_id
    }, null, {
        sort: 'created_at'
    }).lean().then(function(err, courses) {
        courses.forEach(function(course) {
            Lesson.find({
                course_id: course._id
            }).lean().then(function(err, lessons) {
                lessons.forEach(function(lesson, index, theArray) {
                    Score.findOne({
                        lesson_id: lesson._id,
                        student_id: student._id
                    }).lean().then(function(err, score) {
                        if (score == null || Number(score.score) == -1) {
                            courseScore += 0;
                        } else {
                            courseScore += Number(score.score);
                        }

                        if (lessons.length = index + 1) {
                            courseScore = courseScore / lessons.length * 100;
                            Take.update({
                                course_id: course._id,
                                student_id: student_id
                            }, {
                                score: courseScore
                            }, function(err, take) {
                                if (err) console.log(err)
                            })
                        }
                    })
                })
            })
        })
    });
}

exports.resetCourse = function(req, res) {
    var student_id = req.body.student_id,
        course_id = req.body.course_id;

    Lesson.find({
        course_id: course_id
    }, null, {
        sort: 'created_at'
    }, function(err, lessons) {
        lessons.forEach(function(lesson, index, theArray) {
            Score.update({
                lesson_id: lesson._id,
                student_id: student_id
            }, {
                score: Number(-1)
            }, function(err, score) {
                if (err) return console.log(err);

                if (index == theArray.length - 1) {
                    res.send({
                        success: true
                    });
                }
            })
        })
    })

}
