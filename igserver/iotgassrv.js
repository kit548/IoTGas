// SET MODULES HERE, Modules should be added at the beginning

// Express
const express = require('express');
// mongooseJS support
const mongoose = require('mongoose');
// body-parser support for POST commands
const bodyparser = require('body-parser');
// cors Cross-Origin Resource Sharing 
const cors = require('cors')  

// END MODULE SET


// CONNECT TO DBSERVER
mongoose.connect('mongodb://localhost/IoTGas', {useNewUrlParser: true, useFindAndModify: false});
// 28 mongoose.connect('mongodb://localhost/testdb', { useNewUrlParser: true, useFindAndModify: false });
// END DBSERVER CONNECT


// SCHEMA CREATION

var Schema = mongoose.Schema;

// Create schema for each collection
/*
var catSchema = new Schema({
	name: String,
	age: Number
}, {collection: "catcollection", versionKey: false});
*/
var MesoSchema = new Schema(
    {
    gageid: { type: String, required: true, minlength: 2, maxlength: 100 },
    kaasuid: { type: String, required: true, minlength: 2, maxlength: 100 },
    kaasunimi: { type: String, maxlength: 100 },
    arvo: { type: Number, required: true },
    gagetime: { type: Number, required: true },
    }, { collection : "gasgage" }
  );

// map schema to collection
var Meso = mongoose.model('mesomodel', MesoSchema);

// this schema can now be called in other nodejs files
module.exports = Meso;

// END SCHEMA CREATION


// SERVER START
// Express framework with Node.JS
var app = express();
app.use(cors()) 
// Register bodyparser with json support
app.use(bodyparser.json());
// SERVER START END


// ROUTING 
// Get all Mesos, select * from Meso;
app.get('/meso', function (req, res, next) {
//	console.log("all");
	Meso.find({}, function(err, results) {
		if (err) throw err;
		// object of all the users
		console.log(results);
		res.set('Access-Control-Allow-Origin','*');
		res.json(results);
	});
});

app.get('/meso/gases/:id', function (req, res, next) {
	var MesoID = req.params.id;
	Meso.find({ kaasunimi: MesoID }, function(err, results) {
		if (err) throw err;
		console.log(results); 
		res.set('Access-Control-Allow-Origin','*');
		res.json(results);
	});
});

app.get('/meso/last', function (req, res, next) {    
    Meso.findOne().sort({gagetime: -1}).exec(function(err, results) {
		if (err) throw err;
		console.log(results); 
		res.set('Access-Control-Allow-Origin','*');
		res.json(results);
			
	});
});

// Get one Meso by _id
app.get('/meso/:id', function (req, res, next) {
	var MesoID = req.params.id;
	Meso.find({ _id: MesoID }, function(err, results) {
		if (err) throw err;
		// object of all the users
		console.log(results);
		res.set('Access-Control-Allow-Origin','*');
		res.json(results);
	});
});

// kill Meso by _id
app.delete('/meso/delete/:id', function (req, res, next) {
	var MesoID = req.params.id;
	Meso.findOneAndRemove({ _id: MesoID }, function(err, results) {
		if (err) throw err; 
	console.log('deleted: ' + MesoID);
	res.set('Access-Control-Allow-Origin','*');
	res.json(results);
	});
});

// find one and update by _id
app.put('/meso/update/:id', function (req, res, next) {
	var MesoID = req.params.id; 
	console.log('updating ' + MesoID);
	Meso.findOneAndUpdate(
		{ _id: MesoID }, 
		req.body, 
		{ new : true,
		upsert: true, 
		setDefaultsOnInsert: true },
		function(err, Meso) {
			if (err) throw err;
		res.set('Access-Control-Allow-Origin','*');
		res.json(Meso);
		}
	);
});

// create new Meso
app.post('/meso/create', function (req, res, next) {
	var newMeso = new Meso(req.body);
	newMeso.save(function(err, Meso) {
		if (err) throw err;
		console.log('created a new');
		res.set('Access-Control-Allow-Origin','*');
		res.json(Meso);
	});
});
// ROUTING END


// NODEJS SERVER START
// Start nodeJS server
var server = app.listen(3008, function()
{
	var hostport = server.address().port;
	console.log("Express server is listening");
	console.log("Port is: %s", hostport);
});

// NODEJS SERVER START END
	