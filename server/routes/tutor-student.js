var tutorstudent = require('../controllers/tutorstudent');


module.exports = function(app) {
	app.get('/api/tutor/students', function(req, res) {
		tutorstudent.getAllStudents(req, res);
	});

	app.get('/api/tutor/courses', function(req, res) {
		tutorstudent.getAllCourses(req, res);
	});

	app.post('/api/tutor/student', function(req, res) {
		tutorstudent.addStudent(req, res);
	});

	app.post('/api/tutor/studentcsv', function(req, res) {
		tutorstudent.addStudentCSV(req, res);
	});	

	app.put('/api/tutor/student', function(req, res) {
		tutorstudent.editStudent(req, res);
	});

	app.delete('/api/tutor/student', function(req, res) {
		res.send(tutorstudent.deleteStudent(req, res));
	});
}