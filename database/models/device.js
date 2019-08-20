const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const deviceSchema = mongoose.Schema({
    deviceid: {
        type: String,
        unique: true,
        required: true
    },
    stations: {
        type:[String],
        unique:true,
        default:undefined
    },
})

const Device = mongoose.model('device', deviceSchema)
module.exports = Device;