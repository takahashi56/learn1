var login = require('../controllers/login');

module.exports = function(app) {
	app.post('/api/login', function(req, res) {
		res.send(login.login());
	});
}