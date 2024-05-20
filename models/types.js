const Joi = require('joi-oid')
const mongoose = require('mongoose');

const typesSchema = new mongoose.Schema({
    english: {
        type: String,
        required: true,
        min: 1,
        max: 100,
        unique: true
    },
    chinese: {
        type: String,
        min: 1,
        max: 100,
        unique: true
    },
    japanese: {
        type: String,
        min: 1,
        max: 100,
        unique: true
    },
    french: {
        type: String,
        min: 1,
        max: 100,
        unique: true
    }
});

const TypesModel = mongoose.model('types', typesSchema);

const ValidateTypes = (types) => {
    const schema = Joi.object({
        english: Joi.string().min(1).max(100).required(),
        chinese: Joi.string().min(1).max(100),
        japanese: Joi.string().min(1).max(100),
        french: Joi.string().min(1).max(100)
    });

    return schema.validate(types);
}

module.exports = { TypesModel, ValidateTypes };