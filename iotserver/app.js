var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var mesolist = require('./routes/mesolist');
var compression = require('compression');
var helmet = require('helmet');
const cors = require('cors')  

// Create the Express application object
var app = express();
app.use(cors())
app.use(helmet());

// Set up mongoose connection
var mongoose = require('mongoose');
// Read mongodb database information from a file
// Sample secrets.json-file. This file should be in the same folder as this app.js-file.
// {
//    "user": "Database username here"
//    "pass": "Database user password here"
//    "host": "IP/Domain of the db-server here"
//    "port": "Port of the db-server here"
//    "database": "Name of the db to be used here"
// }
if (fs.existsSync('secrets.json')) {
    var secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'));
    var databaseUri = `mongodb://${secrets.user}:${secrets.pass}@${secrets.host}:${secrets.port}/${secrets.database}`;
}
else
{
  var databaseUri = `mongodb://localhost:27017/IoTGas`;
}
//console.log(databaseUri);

//1 var dev_db_url = 'mongodb://cooluser:coolpassword@ds119748.mlab.com:19748/local_library'
//1 var mongoDB = process.env.MONGODB_URI || dev_db_url;
//mongoose.connect(mongoDB);

// New way to connect to MongoDB as the old one is deprecated.
// DeprecationWarning: `open()` is deprecated in mongoose >= 4.11.0, use `openUri()` instead, or set the `useMongoClient` option if using `connect()` 
// or `createConnection()`. See http://mongoosejs.com/docs/4.x/docs/connections.html#use-mongo-client
mongoose.connect(databaseUri, {
useMongoClient: true,
promiseLibrary: global.Promise
});
var db = mongoose.connection; 


db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// View engine setup

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(compression()); // Compress all routes

app.use(express.static(path.join(__dirname, 'public')));

// http://localhost:3000/
app.use('/', index);
// http://localhost:3000/iotlist/ 
app.use('/meso', mesolist);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
