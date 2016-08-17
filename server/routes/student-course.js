var studentcourse = require('../controllers/studentcourse');

module.exports = function(app) {
	app.post('/api/student/getcourselist', function(req, res) {
		studentcourse.getCourseList(req, res);
	});

	app.post('/api/student/getstudentinfo', function(req, res) {
		studentcourse.getStudentInfo(req, res);
	});

	app.post('/api/student/getlessonlist', function(req, res) {
		studentcourse.getLessonList(req, res);
	});

	app.get('/api/student/cert', function(req, res) {
		res.send(studentcourse.viewCertificate());
	});
	

	app.post('/api/student/getcontentslist', function(req, res) {
		studentcourse.getContentsList(req, res);
	});
}