const Joi = require('joi-oid')
const mongoose = require('mongoose');

const typesSchema = new mongoose.Schema({
    accuracy: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    cname: {
        type: String,
        unique: true
    },
    ename: {
        type: String,
        required: true,
        unique: true
    },
    jname: {
        type: String,
        unique: true
    },
    fname: {
        type: String,
        unique: true
    },
    power: {
        type: Number,
        required: true
    },
    pp: {
        type: Number,
        required: true
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'types',
        required: true
    }
});

const MovesModel = mongoose.model('moves', typesSchema);

const ValidateMoves = (moves) => {
    const schema = Joi.object({
        accuracy: Joi.number().required(),
        category: Joi.string().required(),
        cname: Joi.string(),
        ename: Joi.string().required(),
        jname: Joi.string(),
        fname: Joi.string(),
        power: Joi.number().required(),
        pp: Joi.number().required(),
        type: Joi.objectId().required()
    });

    return schema.validate(moves);
}

module.exports = { MovesModel, ValidateMoves };