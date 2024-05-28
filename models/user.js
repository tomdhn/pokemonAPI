const Joi = require('joi-oid')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 1,
        max: 100,
        unique: true
    },
    email: {
        type: String,
        required: true,
        min: 1,
        max: 100,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 1,
        max: 100
    }
});

UserSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id, username: this.username, email: this.email},
    config.get('jwtPrivateKey'));
    return token;
}

const UserModel = mongoose.model('user', UserSchema);

const ValidateUser = (user) => {
    const schema = Joi.object({
        username: Joi.string().min(1).max(100).required(),
        email: Joi.string().min(1).max(100).required().email(),
        password: Joi.string().min(1).max(100).required()
    });

    return schema.validate(user);
}

module.exports = { UserModel, ValidateUser };