// src/controllers/studentcourse.js
var mongoose = require('mongoose'),
  Student = mongoose.model('Student'),
  Take = mongoose.model('Take'),
  Score = mongoose.model('Score'),
  Lesson = mongoose.model('Lesson'),
  Course = mongoose.model('Course'),
  Content = mongoose.model('Content'),
  encrypt = require('../utilities/encryption');

exports.getCourseList = function(req, res) {
  var student_id = req.body.student_id,
      courses = [];
  var i = 0;

  Take.find({student_id: student_id},null, {sort: 'created_at'}, function(err, takes){

    takes.forEach(function (take) {
      Course.findOne({_id: take.course_id}, function(err, course){
        if(err) return console.error(err);

        i++;
        if(course != null){
          var data = {
            course_id: course._id,
            coursetitle: course.name,
            coursedescription: course.description,
            score: take.score,
            progress: take.progress == null? 0 : take.progress,
            isCompleted: take.isCompleted,
            completedAt: take.completedAt,
          }
          courses.push(data);
        }

        if(takes.length == i){
          var completeArray = [], unCompleteArray = [];

          courses.forEach(function(course){
            if(course.isCompleted){
              completeArray.push(course);              
            }else{
              unCompleteArray.push(course)
            }
          });

          completeArray.sort(function(a, b){
            return a.coursetitle.localeCompare(b.coursetitle);    
          })

          unCompleteArray.sort(function(a, b){
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
  Student.findOne({_id: student_id}, function(err, student){
    if(err) return console.log(err);

    res.send(student);
  })
}


exports.getScoreList = function(req, res){
    var student_id = req.body.student_id,
      course_id = req.body.course_id,
      return_data = [];
    Lesson.find({course_id: course_id},null, {sort: 'created_at'}, function(err, lessons){
      var i = 0;
      lessons.forEach(function(lesson){
        Score.findOne({lesson_id: lesson._id, student_id: student_id}, function(err, score){
          i++;
          if(score != null){
            var data = {
              lesson_id: score.lesson_id,
              score: score.score
            }
            return_data.push(data);
          }
          if(i == lessons.length){
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
  console.log("course id" + course_id);
  console.log("student id" + student_id);

  Lesson.find({course_id: course_id}, null, {sort: 'created_at'},function(err, lessons){
    lessons.forEach(function(lesson){
      Score.findOne({lesson_id: lesson._id, student_id: student_id}, function(err, score){
        if(err) return console.log(err);

        Content.count({lesson_id: lesson._id, videoOrQuestion: false}, function(err, content_count){
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

            if(score){
              data.isCompleted = score.isCompleted;
              data.completedAt = score.completedAt;
              data.score = score.score;
              // data.lock = true;
            }

            return_data.push(data);

            if(lessons.length == return_data.length){
              return_data.sort(function(a, b){
                return new Date(a.created_at) - new Date(b.created_at);    
              })

              var one = true;
              return_data.forEach(function(part, index, theArray) { 
              if(Number(theArray[index].score) == Number(-1) && one == true)
               { 
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


exports.getContentsList = function(req, res){
  var lesson_id = req.body.lesson_id;

  Content.find({lesson_id: lesson_id},null, {sort: 'created_at'}, function(err, contents){
    if(err) return console.error(err);

    res.send(contents);
  })
}

exports.setScoreForLesson = function(req, res){
  console.log(req.body);

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

    Score.findOneAndUpdate({lesson_id: lesson_id, student_id: student_id}, data, {upsert: true}, function(err, s){
      if(err) return console.error(err);

      return res.send({sucess: true});
    });
}

exports.setCourseScoreWithStudent = function(req, res){
    console.log('req.body ' + JSON.stringify(req.body));
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

    Take.findOne({course_id: course_id, student_id: student_id}, function(err, take){
      if(err) return console.error(err);

      if(take != null){
            console.log("take  =  " + take);
            take.score = score;
            take.isCompleted = isCompleted;
            take.completedAt = completedAt;
            take.progress = progress;

            take.save();
      }
    })

    res.send({sucess: true});
    // Take.findOneAndUpdate({course_id: course_id, student_id: student_id}, data, {upsert: true}, function(err, s){
    //   if(err) return console.error(err);

    //   return
    // });
}

exports.updateScore = function(req, res){
  var student_id = req.body.student_id;
  console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
  scoreUpdate(student_id);
  res.send({success: true});
}

var scoreUpdate = function(student_id){

   var courseScore = 0;
   Course.find({student_id: student_id},null, {sort: 'created_at'}).lean().then(function(err, courses){
      courses.forEach(function(course){
        Lesson.find({course_id: course._id}).lean().then(function(err, lessons){
          lessons.forEach(function(lesson, index, theArray){
            Score.findOne({lesson_id: lesson._id, student_id: student._id}).lean().then(function(err, score){
              console.log(score);
              if(score == null || Number(score.score) == -1){
                courseScore += 0;
              }else{
                courseScore += Number(score.score);                
              }

              if(lessons.length = index + 1){
                courseScore = courseScore/lessons.length * 100;
                Take.update({course_id: course._id, student_id: student_id}, {score: courseScore}, function(err, take){
                  if(err) console.log(err)
                })
              }
            })
          })
        })
      })
   });
}

exports.resetCourse = function(req, res){
  var student_id = req.body.student_id, 
      course_id = req.body.course_id;

   Lesson.find({course_id: course_id}, null, {sort: 'created_at'},function(err, lessons){
    lessons.forEach(function(lesson, index, theArray){
      Score.update({lesson_id: lesson._id, student_id: student_id}, {score: Number(-1)}, function(err, score){
        if(err) return console.log(err);
        
        if(index == theArray.length -1){
          res.send({success: true});
        }
      })
    })
  })

}