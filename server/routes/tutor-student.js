var tutorstudent = require('../controllers/tutorstudent');


module.exports = function(app) {
	app.post('/api/tutor/students', function(req, res) {
		tutorstudent.getAllStudents(req, res);
	});

	app.post('/api/tutor/courses', function(req, res) {
		tutorstudent.getAllCourses(req, res);
	});

	app.post('/api/tutor/student', function(req, res) {
		tutorstudent.addStudent(req, res);
	});

	app.post('/api/tutor/studentcsv', function(req, res) {
		tutorstudent.addStudentCSV(req, res);
	});

	app.post('/api/tutor/updatestudent', function(req, res) {
		tutorstudent.editStudent(req, res);
	});

	app.post('/api/tutor/setstudentbycourse', function(req, res) {
		console.log(req.body);
		tutorstudent.setStudentByCourse(req, res);
	});

	app.post('/api/tutor/getCoursesByStudentId', function(req, res) {
		tutorstudent.getCoursesByStudentId(req, res);
	});

	app.post('/api/tutor/getStudentsByCourseId', function(req, res) {
		tutorstudent.getStudentsByCourseId(req, res);
	});

	app.post('/api/tutor/removestudent', function(req, res) {
		tutorstudent.removeStudent(req, res);
	});

	app.post('/api/tutor/getlessonsnamebycourseid', function(req, res) {
		tutorstudent.getLessonsNameByCourseId(req, res);
	});

	app.post('/api/tutor/getallmatrix', function(req, res) {
		tutorstudent.getAllMatrix(req, res);
	});

	app.post('/api/tutor/getalluncompleted', function(req, res) {
		tutorstudent.getAllUnCompleted(req, res);
	});

	app.post('/api/tutor/makepdf', function(req, res) {
		tutorstudent.makePdf(req, res);
	});

	app.post('/api/tutor/isvalidoldpwd', function(req, res) {
		tutorstudent.isValidOldPwd(req, res);
	});

	app.post('/api/tutor/changepassword', function(req, res) {
		tutorstudent.changePassword(req, res);
	});

	app.post('/api/tutor/performpayment', function(req, res) {
		tutorstudent.performPayment(req, res);
	});

	app.post('/api/tutor/getstripehistory', function(req, res) {
		tutorstudent.getStripeHistory(req, res);
	});

	app.post('/api/tutor/getgcredirecturl', function(req, res){
		tutorstudent.getGoCardlessRedirectUrl(req,res);
	})

	app.get('/api/tutor/getGoCardlessCompleteUrl', function(req,res){
		tutorstudent.getGoCardlessCompleteUrl(req, res);
	})

	app.post('/api/tutor/updatetutorinfo', function(req,res){
		tutorstudent.getTutorInfo(req, res);
	})
}
