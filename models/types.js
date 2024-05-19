const Joi = require('joi-oid')
const mongoose = require('mongoose');

const typesSchema = new Schema({
    english: {
        type: String,
        required: true,
        min: 1,
        max: 100,
        unique: true
    },
    chinese: {
        type: String,
        required: true,
        min: 1,
        max: 100,
        unique: true
    },
    japanese: {
        type: String,
        required: true,
        min: 1,
        max: 100,
        unique: true
    },
});

const TypesModel = mongoose.model('types', typesSchema);

const ValidateTypes = (types) => {
    const schema = Joi.object({
        english: Joi.string().min(1).max(100).required(),
        chinese: Joi.string().min(1).max(100).required(),
        japanese: Joi.string().min(1).max(100).required()
    });

    return schema.validate(types);
}

module.exports = { TypesModel, ValidateTypes };