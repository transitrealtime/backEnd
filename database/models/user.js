const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email address'})
            }
        }
    },
    trains: {
        type:[String],
        default:undefined
    },
    stations: {
        type:[String],
        default:undefined
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.pre('save', async function(next) {
    const user = this;
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id}, 'transitrealtime')
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

userSchema.statics.findByCredentials = async(username, password) => {
    const user = await User.findOne({username});
    if(!user) {
        throw new Error({eror: "Invalid user credentialsl."});
    }

    const isPassWordMatch = await bcrypt.compare(password, user.password);
    if(!isPassWordMatch) {
        throw new Error({eror: "Invalid user credentialsl."});
    }
    return user;
}

const User = mongoose.model('User', userSchema)
module.exports = User;
