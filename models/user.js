const Joi = require('joi-oid')
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    admin: {
        type: Boolean,
        required: true,
        default: false
    },
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

const UserModel = mongoose.model('user', UserSchema);

const ValidateUser = (user) => {
    const schema = Joi.object({
        admin: Joi.boolean(),
        username: Joi.string().min(1).max(100).required(),
        email: Joi.string().min(1).max(100).required().email(),
        password: Joi.string().min(1).max(100).required()
    });

    return schema.validate(user);
}

module.exports = { UserModel, ValidateUser };