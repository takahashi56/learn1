var tutorstudent = require('../controllers/tutorstudent');

module.exports = function(app) {
	app.get('/api/tutor/students', function(req, res) {
		res.send(tutorstudent.getAllStudents());
	});

	app.post('/api/tutor/student', function(req, res) {
		res.send(tutorstudent.addStudent());
	});

	app.post('/api/tutor/studentcsv', function(req, res) {
		res.send(tutorstudent.addStudentCSV());
	});	

	app.put('/api/tutor/student', function(req, res) {
		res.send(tutorstudent.editStudent());
	});

	app.delete('/api/tutor/student', function(req, res) {
		res.send(tutorstudent.deleteStudent());
	});
}