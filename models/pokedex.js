const Joi = require('joi-oid')
const mongoose = require('mongoose');

const pokedexSchema = new mongoose.Schema({
    name: {
        english: {
            type: String,
            required: true,
            min: 1,
            max: 100
        },
        japanese: {
            type: String,
            required: true,
            min: 1,
            max: 100
        },
        chinese: {
            type: String,
            required: true,
            min: 1,
            max: 100
        }
    },
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'types',
        required: true
    }],
    base: {
        HP: {
            type: Number,
            required: true
        },
        Attack: {
            type: Number,
            required: true
        },
        Defense: {
            type: Number,
            required: true
        },
        "Sp. Attack": {
            type: Number,
            required: true
        },
        "Sp. Defense": {
            type: Number,
            required: true
        },
        Speed: {
            type: Number,
            required: true
        }
    },
    moves: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'moves'
    }]
});

const PokedexModel = mongoose.model('pokedex', pokedexSchema);

const ValidatePokedex = (pokedex) => {
    const schema = joi.object({
        name: joi.object({
            english: joi.string().min(1).max(100).required(),
            japanese: joi.string().min(1).max(100).required(),
            chinese: joi.string().min(1).max(100).required()
        }),
        type: joi.array().items(joi.ObjectId()).required(),
        base: joi.object({
            HP: joi.number().required(),
            Attack: joi.number().required(),
            Defense: joi.number().required(),
            "Sp. Attack": joi.number().required(),
            "Sp. Defense": joi.number().required(),
            Speed: joi.number().required()
        }),
        moves: joi.array().items(joi.ObjectId())
    });

    return schema.validate(pokedex);
}

module.exports = { PokedexModel, ValidatePokedex };
