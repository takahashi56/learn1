// src/controllers/admincourse.js
var mongoose = require('mongoose'),
    Admin = mongoose.model('Admin'),
    Course = mongoose.model('Course'),
    Lesson = mongoose.model('Lesson'),
    Content = mongoose.model('Content'),
    Take = mongoose.model('Take'),
    Part = mongoose.model('Part'),
    Score = mongoose.model('Score'),
    _ = require('lodash'),
    encrypt = require('../utilities/encryption'),
    Promise = require('bluebird');

const path = require('path');

Promise.promisifyAll(mongoose);

exports.getAllCourse = function(req, res) {
    // var courses = [], lessons = [], takes = [], contents = [], main_data = [];
    //
    // Promise.props({
    //   courses: Course.find().execAsync(),
    //   lessons: Lesson.find().execAsync(),
    // 	takes: Take.find().execAsync(),
    // 	contents: Content.find().execAsync()
    // })
    // .then(function(results) {
    //
    // 	_.forEach(results.courses, function(course) {
    // 		var take_count = _.countBy(results.takes, function(o) {return o.course_id == course._id });
    //
    // 		if(results.lessons.length == 0){
    // 			main_data.push({
    // 				course_id: course._id,
    // 				title: course.name,
    // 				lesson: 0,
    // 				video: 0,
    // 				student: 0
    // 			})
    // 		}else{
    // 			_.forEach(results.lessons, function(lesson) {
    // 				var video_count = _.countBy(results.contents, function(o) { return o.lesson_id == lesson._id && o.videoOrQuestion == true});
    //
    // 				main_data.push({
    // 					course_id: course._id,
    // 					title: course.name,
    // 					lesson: i,
    // 					video: video_count,
    // 					student: take_count
    // 				});
    // 			});
    // 		}
    // 	});
    //
    // 	main_data = _.orderBy(main_data, ['title']);
    // 	res.send(main_data);
    // })
    // .catch(function(err) {
    //
    //   res.send(err); // oops - we're even handling errors!
    // });


    Course.find({}, null, {
        sort: 'created_at'
    }, function(err, collection) {
        if (err) {
            return console.error(err);
        }
        var main_data = [];

        collection.forEach(function(course) {

            Lesson.find({
                course_id: course._id
            }, null, {
                sort: 'created_at'
            }, function(err, lessons) {
                if (err) return console.error(err);

                Take.count({
                    course_id: course._id
                }, function(err, student_count) {
                    if (err) return console.error(err);

                    if (lessons.length == 0) {
                        var data = {
                            course_id: course._id,
                            title: course.name,
                            draftORLive: course.draftORLive,
                            lesson: 0,
                            video: 0,
                            student: 0
                        }
                        main_data.push(data);
                        if (main_data.length == collection.length) {
                            main_data.sort(function(a, b) {
                                return a.title.localeCompare(b.title);
                            })
                            res.send(main_data).end();
                        }
                    }

                    var video_count = 0,
                        i = 0;
                    lessons.forEach(function(lesson) {
                        Part.count({
                            lesson_id: lesson._id,
                            slideOrQuestion: true
                        }, function(err, content_count) {
                            if (err) return console.error(err);
                            i++;
                            video_count += content_count;

                            if (i == lessons.length) {
                                var data = {
                                    course_id: course._id,
                                    title: course.name,
                                    draftORLive: course.draftORLive,
                                    lesson: i,
                                    video: video_count,
                                    student: student_count
                                }
                                main_data.push(data);
                            }
                            if (main_data.length == collection.length) {
                                main_data.sort(function(a, b) {
                                    return a.title.localeCompare(b.title);
                                })
                                res.send(main_data);
                            }
                        })
                    })
                })
            })
        });
    });
}


exports.getEditCourses = function(req, res) {
    var id = req.body.id;

    Course.findOne({
        _id: id
    }, function(err, course) {
        if (err) return console.error(err);

        var data = {
            course_id: course._id,
            coursetitle: course.name,
            draftORLive: course.draftORLive,
            coursedescription: course.description,
            lesson: []
        }
        Lesson.find({
            course_id: course._id
        }, null, {
            sort: 'created_at'
        }, function(err, lessons) {
            if (err) return console.error(err);

            if (lessons.length == 0) {
                res.send(data).end();
                return;
            }

            var lessonData = {};
            lessons.forEach(function(lesson) {
                Part.find({
                    lesson_id: lesson._id
                }, null, {
                    sort: 'order'
                }, function(err, contents) {
                    if (err) return console.error(err);

                    lessonData = {
                        lesson_id: lesson._id,
                        lessonname: lesson.name,
                        lessondescription: lesson.description,
                        content: contents,
                        created_at: lesson.created_at
                    }

                    data.lesson.push(lessonData);
                    if (lessons.length == data.lesson.length) {
                        data.lesson.sort(function(a, b) {
                            return new Date(a.created_at) - new Date(b.created_at);
                        })
                        res.send(data);
                    }
                })
            })
        })
    })
}



exports.getAllContent = function(req, res) {
    Part.find({}, null, {
        sort: 'created_at'
    }, function(err, collection) {
        if (err) {
            return console.error(err);
        }
        collection.sort(function(a, b) {
            return new Date(a.created_at) - new Date(b.created_at);
        })
        res.send(collection);
    })
}

exports.addCourse = function(req, res) {
    var data = req.body,
        courseData = {
            name: data.coursetitle,
            description: data.coursedescription,
            draftORLive: data.draftORLive
        },
        lessonList = data.lesson;
    console.log(data);
    Course.create(courseData, function(err, course) {
        if (err) return console.error(err);

        if (lessonList.length == 0) return;

        lessonList.forEach(function(lesson) {
            var lessonData = {
                name: lesson.lessonname,
                description: lesson.lessondescription,
                course_id: course._id
            }
            Lesson.create(lessonData, function(err, less) {
                if (err) return console.error(err);

                lesson.content.forEach(function(content) {
                    var contentData = {
                        slideOrQuestion: content.slideOrQuestion,
                        slideContent: content.slideContent,
                        label: content.label,
                        question: content.question,
                        answerA: content.answerA,
                        answerB: content.answerB,
                        answerC: content.answerC,
                        answerD: content.answerD,
                        trueNumber: content.trueNumber,
                        answerText: content.answerText,
                        lesson_id: less._id,
                        questionType: content.questionType,
                        image: content.image,
												order: content.order
                    }
                    Part.create(contentData, function(err, cont) {
                        if (err) return console.error(err);
                    })
                })
            })
        })
    })
    res.send({
        success: true
    });
}



exports.updateCourse = function(req, res) {
    var data = req.body,
        courseData = {
            _id: data.course_id,
            name: data.coursetitle,
            draftORLive: data.draftORLive,
            description: data.coursedescription
        },
        lessonList = data.lesson;

    Course.update({
        _id: courseData._id
    }, courseData, function(err, course) {
        if (err) return console.error(err);

        Lesson.remove({
            course_id: courseData._id
        }, function(err) {
            if (err) throw err;

            lessonList.forEach(function(lesson) {
                var lessonData = {
                    name: lesson.lessonname,
                    description: lesson.lessondescription,
                    course_id: courseData._id,
                    created_at: lesson.created_at
                }
                var reg = new RegExp('^[0-9]+$');
                if (reg.test(lesson.lesson_id.toString()) == false) {
                    lessonData["_id"] = lesson.lesson_id;
                }

                Lesson.create(lessonData, function(err, less) {
                    if (err) return console.error(err);

                    Part.remove({
                        lesson_id: lesson.lesson_id
                    }).exec();


                    lesson.content.forEach(function(content) {
                        var contentData = {
                            slideOrQuestion: content.slideOrQuestion,
                            slideContent: content.slideContent,
                            label: content.label,
                            question: content.question,
                            answerA: content.answerA,
                            answerB: content.answerB,
                            answerC: content.answerC,
                            answerD: content.answerD,
                            trueNumber: content.trueNumber,
                            answerText: content.answerText,
                            lesson_id: less._id,
                            questionType: content.questionType,
                            image: content.image,
														order: content.order
                        }

                        if (content._id.length >  14) {
                            contentData["_id"] = content._id;
                        }
                        Part.create(contentData, function(err, cont) {
                            if (err) return console.error(err);
                        })
                    })

                })
            })
        })

        // lessonList.forEach(function(lesson){
        // 	var lessonData = {
        // 		name: lesson.lessonname,
        // 		description: lesson.lessondescription,
        // 		course_id: courseData._id
        // 	}

        // 	console.log('==================course iterate=====================');
        // 	console.log(lessonList.length);
        // 	var reg = new RegExp('^[0-9]+$');
        // 	if(reg.test(lesson.lesson_id)){

        // 		console.log("create$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        // 		Lesson.create(lessonData, function(err, less1){
        // 			if (err) return console.error(err);

        // 			console.log(lesson.content);

        // 			lesson.content.forEach(function(content){
        // 				var contentData = {
        // 					videoOrQuestion: content.videoOrQuestion,
        // 				    videoLabel: content.videoLabel,
        // 				    videoEmbedCode: content.videoEmbedCode,
        // 				    singleOrMulti: content.singleOrMulti,
        // 				    question: content.question,
        // 				    answerA: content.answerA,
        // 				    answerB: content.answerB,
        // 				    answerC: content.answerC,
        // 				    trueNumber: content.trueNumber,
        // 				    answer_text: '',
        // 				    lesson_id: less1.id,
        // 				}
        // 				Content.create(contentData, function(err, cont){
        // 					if (err) return console.error(err);

        // 					console.log("(((((((((((sucess)))))))))))))))))))");
        // 					console.log(cont)
        // 				})
        // 			})
        // 		})
        // 	}else{
        // 		Lesson.findOne({_id: lesson.lesson_id}, function(err, less){
        // 			if (err) return console.error(err);

        // 			less.name = lesson.lessonname;
        // 			less.description = lesson.lessondescription;
        // 			less.course_id = courseData._id;

        // 			console.log('==================find less===================');
        // 			console.log(less);

        // 			less.save(function(err){
        // 				if(err) throw err;

        // 				lesson.content.forEach(function(content){
        // 					var contentData = {
        // 						videoOrQuestion: content.videoOrQuestion,
        // 					    videoLabel: content.videoLabel,
        // 					    videoEmbedCode: content.videoEmbedCode,
        // 					    singleOrMulti: content.singleOrMulti,
        // 					    question: content.question,
        // 					    answerA: content.answerA,
        // 					    answerB: content.answerB,
        // 					    answerC: content.answerC,
        // 					    trueNumber: content.trueNumber,
        // 					    answer_text: '',
        // 					    lesson_id: less._id,
        // 					}

        // 					console.log(contentData);

        // 					if(content._content_id){
        // 						Content.create(contentData, function(err, content){
        // 							if (err) return console.error(err);

        // 							console.log("!!!!!!!!!!!!!!!!!!!!!!! create !!!!!!!!!!!!!!!!!!")
        // 						})
        // 					}else{
        // 						contentData["_id"] = content._id;
        // 						Content.update({_id: content._id},contentData, function(err, cont){
        // 							if (err) return console.error(err);

        // 							console.log("!!!!!!!!!!!!!!!!!!!!!!! update !!!!!!!!!!!!!!!!")
        // 						})
        // 					}
        // 				})
        // 			})
        // 		})
        // 	}
        // })
        res.send({
            success: true
        });
    })
}

exports.deleteCourse = function(req, res) {
    var list = req.body.list;

    list.forEach(function(l) {
        Course.findOneAndRemove({
            _id: mongoose.Types.ObjectId(l)
        }, function(err, removed) {
            if (err) console.error(err);

            Lesson.find({
                course_id: l
            }, function(err, lessons) {
                if (err) console.error(err);

                lessons.forEach(function(lesson) {
                    Part.find({
                        lesson_id: lesson._id
                    }, function(err, contents) {
                        contents.forEach(function(content) {
                            content.remove();
                        });
                    });
                    Score.find({
                        lesson_id: lesson._id
                    }, function(err, scores) {
                        scores.forEach(function(score) {
                            score.remove();
                        })
                    })
                })

                lessons.forEach(function(lesson) {
                    lesson.remove();
                });
            })

            Take.find({
                course_id: l
            }, function(err, takes) {
                if (err) console.error(err);

                takes.forEach(function(take) {
                    take.remove();
                });
            })
        })
    })

    res.send({
        success: true
    });
}


exports.upload = function(req, res) {
    var sampleFile,
        filename = (new Date % 9e6).toString(36);

    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    sampleFile = req.files.uploads;
    console.log(sampleFile);
    filename = (filename + sampleFile.name).replace(/\s+/g, '_');

    var filePath = path.join(__dirname, '../public/images/upload/', filename);

    sampleFile.mv(filePath, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send({
                image: filename
            });
        }
    });
}