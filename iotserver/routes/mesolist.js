var express = require('express');
var router = express.Router();

var meso_controller = require('../controllers/mesoController'); 

// meso ROUTES //
// console.log("router start");

// GET entire meso 
router.get('/', meso_controller.meso_getall_get);

// GET about 
router.get('/about', meso_controller.meso_getabout_get); 

// GET last 100 measures 
router.get('/last100', meso_controller.meso_getlast100);  

// GET last 100 gagetime and arvo of the gas 
router.get('/gasvalueslast100/:gasname', meso_controller.meso_getgasvalueslast100);  

// GET last x gagetime and arvo of the gas 
router.get('/gasvalues/:gasname/:mesos', meso_controller.meso_getgasvalueslastX); 

// GET last measure
router.get('/last', meso_controller.meso_getlast_get);  

// GET last measure of the gas
router.get('/gaslast/:gasname', meso_controller.meso_getgasxlast_get);  

// GET measured gas names  
router.get('/gasenames', meso_controller.meso_getgases_distinct); 

// GET measure by gas name  
router.get('/gases/:gasname', meso_controller.meso_getgases_get); 

// POST one measure
router.post('/create', meso_controller.meso_createone_post);

// GET one measure by _id
router.get('/:id', meso_controller.meso_getone_get); 

// PUT one measure by _id
router.put('/update/:id', meso_controller.meso_updateone_put);

// DELETE one measure
router.delete('/delete/:id', meso_controller.meso_deleteone_delete);

console.log("router...");

module.exports = router;