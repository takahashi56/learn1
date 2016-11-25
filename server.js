var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    cors = require('cors');

var favicon = require('serve-favicon');


var fileUpload = require('express-fileupload');
var app = express();

app.use(favicon(__dirname + '/favicon.png'));

var port = process.env.PORT || 5000;

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./server/config/config')[env];

require('./server/config/mongoose')(config);

app.use(express.static(__dirname + '/server/public'));
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/app'));
app.use(fileUpload());

app.set('views', './server/views');
app.set('view engine', 'jade');

app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(cookieParser());

app.use(cors());

require('./server/models/User')();

require('./server/models/Admin')();

require('./server/models/Content')();

require('./server/models/Course')();

require('./server/models/Lesson')();

require('./server/models/Score')();

require('./server/models/Student')();

require('./server/models/StripeTransaction')();

require('./server/models/Take')();

require('./server/models/Tutor')();



require('./server/routes/routes')(app);

app.listen(port, function(err) {
    console.log('running server on port: ' + port);
});
