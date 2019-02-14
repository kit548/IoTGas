const express = require('express');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors')  
const index = require('./routes/index');
const mesolist = require('./routes/mesolist');

// Create the Express application object
const app = express();
app.use(cors())
app.use(helmet());

// Set up mongoose connection
const mongoose = require('mongoose');
// Read mongodb database information from a file
// Sample secrets.json-file. This file should be in the same folder as this app.js-file.
// {
//    "user": "Database username here",
//    "pass": "Database user password here",
//    "host": "IP/Domain of the db-server here",
//    "port": "Port of the db-server here",
//    "database": "Name of the db to be used here"
// }
if (fs.existsSync('secrets.json')) {
  try {
    var secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'));
    var databaseUri = `mongodb://${secrets.user}:${secrets.pass}@${secrets.host}:${secrets.port}/${secrets.database}`;
  }
  catch(e) {
    console.error("secrets.json-tiedoston luku epäonnistui. Virhekoodi: " + e.message);
  }
}
else {
  var databaseUri = `mongodb://localhost:27017/IoTGas`;
}

//console.log(databaseUri);
mongoose.connect(databaseUri, {
  useMongoClient: true,
  //useNewUrlParser: true, // not used <- 4.13.8
  promiseLibrary: global.Promise, 
});
const db = mongoose.connection; 
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// View engine setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); // Compress all routes
app.use(express.static(path.join(__dirname, 'public')));

// localhost:port/
app.use('/', index);
// localhost:port/mesolist/ 
app.use('/meso', mesolist);
console.log("router...");

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
