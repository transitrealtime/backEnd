const mongoose = require('mongoose');
const md5Hex = require('md5-hex');
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

deviceSchema.pre('save', async function(next) {
    const device = this;
    device.deviceid = await md5Hex(device.deviceid)
    next();
})

deviceSchema.statics.findSaltDevice = async(id) => { 
    const device = await Device.findOne({deviceid:id});
    
    if(!device) {
        console.log("Can't find.");
        return
    }
    
    return device;
}

const Device = mongoose.model('device', deviceSchema)
module.exports = Device;