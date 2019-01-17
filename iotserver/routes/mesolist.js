var express = require('express');
var router = express.Router();

var meso_controller = require('../controllers/mesoController'); 

// meso ROUTES //
// console.log("router start");

// GET entire meso 
router.get('/', meso_controller.meso_getall_get);

// GET about 
router.get('/about', meso_controller.meso_getabout_get); 

// GET last x gagetime and arvo of the gas 
router.get('/gasvalues/:gasname/:mesos', meso_controller.meso_getgasxlastxvalues); 

// GET last measure
router.get('/last', meso_controller.meso_getlast_get);  

// GET last measure of the gas
router.get('/gaslast/:gasname', meso_controller.meso_getgasxlastmeso_get);  

// GET measured gas names  
router.get('/gasnames', meso_controller.meso_getgases_distinct); 

// GET measured gases last values with gas name  
router.get('/lastvalues', meso_controller.meso_getgases_distinct_lastmeso); 

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
