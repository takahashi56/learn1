var studentcourse = require('../controllers/studentcourse');

module.exports = function(app) {
	app.get('/api/student/courses', function(req, res) {
		res.send(studentcourse.getAllCourse());
	});

	app.get('/api/student/course/lesson', function(req, res) {
		res.send(studentcourse.getAllLessonByCourse());
	});

	app.get('/api/student/course/lesson/content', function(req, res) {
		res.send(studentcourse.getAllContentByLesson());
	});

	app.get('/api/student/cert', function(req, res) {
		res.send(studentcourse.viewCertificate());
	});
	

	app.post('/api/student/test/lesson', function(req, res) {
		res.send(studentcourse.postLesson());
	});
}