var admintutor = require('../controllers/admintutor');

module.exports = function(app) {
	app.get('/api/admin/tutors', function(req, res) {
		res.send(admintutor.getAllTutors());
	});

	app.post('/api/admin/tutor', function(req, res) {
		res.send(admintutor.addTutor());
	});

	app.put('/api/admin/tutor', function(req, res) {
		res.send(admintutor.editTutor());
	});

	app.delete('/api/admin/tutor', function(req, res) {
		res.send(admintutor.deleteTutor());
	});
}