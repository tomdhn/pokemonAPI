const Joi = require('joi-oid')
const mongoose = require('mongoose');

const typesSchema = new Schema({
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
        required: true
    },
    ename: {
        type: String,
        required: true
    },
    jname: {
        type: String,
        required: true
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
        cname: Joi.string().required(),
        ename: Joi.string().required(),
        jname: Joi.string().required(),
        power: Joi.number().required(),
        pp: Joi.number().required(),
        type: Joi.objectId().required()
    });

    return schema.validate(moves);
}

module.exports = { MovesModel, ValidateMoves };