const Joi = require('joi-oid')
const mongoose = require('mongoose');

const pokedexSchema = new mongoose.Schema({
    name: {
        english: {
            type: String,
            required: true,
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
        chinese: {
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
    const schema = Joi.object({
        name: Joi.object({
            english: Joi.string().min(1).max(100).required(),
            japanese: Joi.string().min(1).max(100),
            chinese: Joi.string().min(1).max(100),
            french: Joi.string().min(1).max(100)
        }),
        type: Joi.array().items(Joi.ObjectId()).required(),
        base: Joi.object({
            HP: Joi.number().required(),
            Attack: Joi.number().required(),
            Defense: Joi.number().required(),
            "Sp. Attack": Joi.number().required(),
            "Sp. Defense": Joi.number().required(),
            Speed: Joi.number().required()
        }),
        moves: Joi.array().items(Joi.ObjectId())
    });

    return schema.validate(pokedex);
}

module.exports = { PokedexModel, ValidatePokedex };
