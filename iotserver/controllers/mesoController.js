var MesoModel = require('../models/mesomodel')
var async = require('async')

const minPituus = 2; 
const maxPituus = 20; 

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.meso_getgases_distinct = function (req, res, next) 
{ 
	MesoModel.distinct('kaasunimi', function(err2, res2) 
	{ 	
		console.log("kit Meso_get_gasnames");
		// jump away if error found
		if (err2) { return next(err2); }
		else
		{	console.log(res2);
			res.set('Access-Control-Allow-Origin','*');
			res.json(res2);
		}	
	});
};

exports.meso_getall_get = function (req, res, next) 
{ 
	MesoModel.find({}, function(err2, res2) 
	{ 	
		console.log("kit Meso_getall_get");
		// jump away if error found
		if (err2) { return next(err2); }
		else
		{	res.set('Access-Control-Allow-Origin','*');
			res.json(res2);
		}	
	});
};

exports.meso_getone_get = function (req, res, next) 
{
	MesoModel.find({ _id: req.params.id }, function(err2, res2)
	{ 	
		console.log("kit Meso_getone_get:" + req.params.id );
		// jump away if error found
		if (err2) { return next(err2); }
		else
		{ 	console.log(res2); 
			res.set('Access-Control-Allow-Origin','*');
			res.json(res2);
		}	
	});
};

exports.meso_getgases_get = function (req, res, next) 
{
	MesoModel.find({ kaasunimi: req.params.gasname }, function(err2, res2) 
	{ 	
		console.log("kit Meso_getgases_get:" + req.params.gasname );
		// jump away if error found
		if (err2) { return next(err2); }
		else
		{ 	console.log(res2); 
			res.set('Access-Control-Allow-Origin','*');
			res.json(res2);
		}	
	});
};

exports.meso_getlast_get = function (req, res, next) 
{    //MesoModel.find({}, function(err2, res2) 
    MesoModel.findOne().sort({gagetime: -1}).exec(function(err2, res2)
	{ 	
		console.log("kit Meso_getlast_get"); 
		// jump away if error found
		if (err2) { return next(err2); }
		else 
		{ 	console.log(res2); 
			res.set('Access-Control-Allow-Origin','*');
			res.json(res2);
		}	
	});
};

exports.meso_getgasxlastmeso_get = function (req, res, next) 
{   console.log(req.params.gasname); 
	MesoModel.findOne({ kaasunimi: req.params.gasname }, 
		).sort({gagetime: -1}).limit(-1).exec(function(err2, res2)
	{ 	
		console.log("kit Meso_getgasxlastmeso_get"); 
		// jump away if error found
		if (err2) { return next(err2); }
		else
		{	res.set('Access-Control-Allow-Origin','*');
			res.json(res2);
		}	
	});
};

exports.meso_getgasxlastxvalues = function (req, res, next) 
{   console.log(req.params.gasname); console.log(req.params.mesos);
	MesoModel.find({ kaasunimi: req.params.gasname }, 
		{_id:0, gagetime: 1, arvo: 1}
		).sort({gagetime: -1}).limit(-req.params.mesos).exec(function(err2, res2)
	{ 	
		console.log("kit meso_getgasxlastxvalues"); 
		// jump away if error found
		if (err2) { return next(err2); }
		else
		{	res.set('Access-Control-Allow-Origin','*');
			res.json(res2);
		}	
	});
};

exports.meso_getabout_get = function (req, res, next) 
{   
	console.log("Meso_about"); 		
	res.json("About IotGas: kit, Aapo, and Lassi. " +  
	   "The body of this 'back end sw' is from IoT course"
	   );
};


exports.meso_createone_post = 
[
	// Validate input
	body('gageid').isLength({ min: minPituus, max: maxPituus }).trim().withMessage('gageid too long or short'),
	body('kaasuid').isLength({ min: minPituus, max: maxPituus }).trim().withMessage('kaasuid too long or short'),
	body('kaasunimi').isLength({ max: maxPituus }).trim().withMessage('kaasunimi too long or short'),
	//body('arvo')....
	
	// Sanitize fields
    sanitizeBody('gageid').trim().escape(),
    sanitizeBody('kaasuid').trim().escape(),
    sanitizeBody('kaasunimi').trim().escape(),

    (req, res, next) => {
	const validationerror = validationResult(req);
	//console.log("kit Meso_creating"); 
	if (!validationerror.isEmpty())
	{
		return res.status(422).json({ errors: validationerror.mapped() });
	}

	let NewIotlist = new MesoModel
	({
		gageid: req.body.gageid,
		kaasuid: req.body.kaasuid,
		kaasunimi: req.body.kaasunimi,
		arvo: req.body.arvo,
		gagetime: req.body.gagetime
	});
	//console.log(NewIotlist.arvo); 
	
	NewIotlist.save( function(err2, res2)
	{
		//console.log("kit Meso_createone_post");
		// jump away if error found
		if (err2)
		{
			return next(err2);
		}
		else
		{
			//console.log("kit Meso_create_json"); 
			res.set('Access-Control-Allow-Origin','*');
			res.json(res2);
		}	
	});
	
}
];

exports.meso_updateone_put = 
[
	//Validate input
	body('gageid').isLength({ min: minPituus, max: maxPituus }).trim().withMessage('gageid too long or short'),
	body('kaasuid').isLength({ min: minPituus, max: maxPituus }).trim().withMessage('kaasuid too long or short'),
	body('kaasunimi').isLength({ max: maxPituus }).trim().withMessage('kaasunimi too long or short'),
	
	// Sanitize fields
    sanitizeBody('gageid').trim().escape(),
    sanitizeBody('kaasuid').trim().escape(),
    sanitizeBody('kaasunimi').trim().escape(),
    
	(req, res, next) => {
	const validationerror = validationResult(req);
	
	if (!validationerror.isEmpty())
	{
		return res.status(423).json({ errors: validationerror.mapped() });
	}
	console.log(req.params.id); 
	MesoModel.findOneAndUpdate(
		{ _id : req.params.id },
		req.body,
		{ new : true }, // returns updated picture info 
		function(err2, res2)
		{
			//console.log("kit Meso_updateone_put");
			// jump away if error found
			if (err2)
			{
				return next(err2);
			}
			else
			{
				// no error - return this //res.json({text: 'put one'}) 
				console.log("kit Meso_put_json");
				res.set('Access-Control-Allow-Origin','*');
				res.json(res2);
			}	
		}
	);
}
];

exports.meso_deleteone_delete = function (req, res, next) 
{
	MesoModel.findOneAndRemove( 
		{ _id: req.params.id },
		function(err2, res2)
		{
			//console.log("Iotlist_deleteone_delete");
			// jump away if error found
			if (err2)
			{
				return next(err2);
			}
			else
			{
				// no error - return this //res.json({text: 'delete one'}) 
				console.log('kit Meso info: Delete one'); 
				res.set('Access-Control-Allow-Origin','*');
				res.json(res2);
			}	
		});
};
