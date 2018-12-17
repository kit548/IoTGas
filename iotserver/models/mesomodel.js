var mongoose = require('mongoose');
var moment = require('moment'); // For date handling.

const minPituus = 2; 
const maxPituus = 20; 

var Schema = mongoose.Schema;

var IotSchema = new Schema(
    {
    gageid: { type: String, required: true, minlength: minPituus, maxlength: maxPituus },
    kaasuid: { type: String, required: true, minlength: minPituus, maxlength: maxPituus },
    kaasunimi: { type: String, maxlength: maxPituus },
    arvo: { type: Number, required: true },
    gagetime: { type: Number, required: true }
    }, { collection : "gasgage" }
  );

// Export model.
module.exports = mongoose.model('Mesomodel', IotSchema);
