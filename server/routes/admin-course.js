var admincourse = require('../controllers/admincourse'),
	auth = require('../config/auth');

module.exports = function(app) {
	app.get('/api/admin/courses', auth.authCheck, function(req, res) {
		res.send(admincourse.getAllCourse());
	});

	app.post('/api/admin/course', function(req, res) {
		res.send(admincourse.addCourse());
	});

	app.post('/api/admin/lesson', function(req, res) {
		res.send(admincourse.addLesson());
	});

	app.put('/api/admin/course', function(req, res) {
		res.send(admincourse.editCourse());
	});

	app.put('/api/admin/lesson', function(req, res) {
		res.send(admincourse.editLesson());
	});

	app.delete('/api/admin/course', function(req, res) {
		res.send(admincourse.deleteCourse());
	});
}