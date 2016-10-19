var adminlogin = require('../controllers/adminlogin');

module.exports = function(app) {
	app.post('/api/admin/login', function(req, res) {
		res.send(users.confirmLogin());
	});

	app.post('/api/admin/isvalidoldpwd', function(req, res) {
		adminlogin.isValidOldPwd(req, res);
	});

	app.post('/api/admin/changepassword', function(req, res) {
		adminlogin.changePassword(req, res);
	});

	app.post('/api/admin/add/admin', function(req, res) {
		adminlogin.addAdmin(req, res);
	});

	app.post('/api/admin/edit/admin', function(req, res) {
		adminlogin.editAdmin(req, res);
	});

	app.post('/api/admin/adminslist', function(req, res) {
		adminlogin.getAllAdmins(req, res);
	});

	app.post('/api/admin/removeadmin', function(req, res) {
		adminlogin.removeAdmin(req, res);
	});
}
