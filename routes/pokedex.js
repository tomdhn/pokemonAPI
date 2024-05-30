const express = require('express');
const { PokedexModel, ValidatePokedex } = require('../models/pokedex');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    /* 
    #swagger.tags = ['Pokedex']
    #swagger.description = 'Create a new entry in the Pokedex'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Pokedex information',
        required: true,
        schema: {
            $name: {
                english: 'EnglishName',
                japanese: 'JapaneseName',
                chinese: 'ChineseName',
                french: 'FrenchName'
            },
            $type: ['typeid'],
            $base: {
                HP: 'Hit Points',
                Attack: 'Attack',
                Defense: 'Defense',
                'Sp. Attack': 'Special Attack',
                'Sp. Defense': 'Special Defense',
                Speed: 'Speed'
            },
            $moves: ['MovesIds']
        } 
    }
    */
    const { error } = ValidatePokedex(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let pokedex = new PokedexModel({
        name: {
            english: req.body.name.english,
            japanese: req.body.name.japanese,
            chinese: req.body.name.chinese,
            french: req.body.name.french
        },
        type: req.body.type,
        base: {
            HP: req.body.base.HP,
            Attack: req.body.base.Attack,
            Defense: req.body.base.Defense,
            "Sp. Attack": req.body.base["Sp. Attack"],
            "Sp. Defense": req.body.base["Sp. Defense"],
            Speed: req.body.base.Speed
        },
        moves: req.body.moves
    });

    try {
        pokedex = await pokedex.save();
        res.status(200).send(pokedex);
    } catch (err) {
        res.status(400).send(err.message);
    }  
});

router.get('/', async (req, res) => {
    /*
      #swagger.tags = ['Pokedex']
      #swagger.description = 'Retrieve all entries from the Pokedex.'
    */
    try {
        const pokedex = await PokedexModel.find().populate('type').populate('moves');
        res.status(200).send(pokedex);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get('/:id', async (req, res) => {
    /*
      #swagger.tags = ['Pokedex']
      #swagger.description = 'Retrieve a specific entry from the Pokedex by ID.'
      #swagger.parameters['id'] = { in: 'path', description: 'ID of the Pokedex entry', required: true, type: 'string' }
    */
    try {
        const pokedex = await PokedexModel.findById(req.params.id).populate('type').populate('moves');
        if (!pokedex) return res.status(404).send('Pokedex entry not found.');
        res.status(200).send(pokedex);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

router.patch('/:id', auth, async (req, res) => {
    /*
      #swagger.tags = ['Pokedex']
      #swagger.description = 'Update a specific entry in the Pokedex by ID.'
      #swagger.parameters['id'] = { in: 'path', description: 'ID of the Pokedex entry', required: true, type: 'string' }
      #swagger.parameters['body'] = { in: 'body', description: 'Updated information for the Pokedex entry', required: true, 
      schema: {
            $name: {
                english: 'EnglishName',
                japanese: 'JapaneseName',
                chinese: 'ChineseName',
                french: 'FrenchName'
            },
            $type: ['typeid'],
            $base: {
                HP: 'Hit Points',
                Attack: 'Attack',
                Defense: 'Defense',
                'Sp. Attack': 'Special Attack',
                'Sp. Defense': 'Special Defense',
                Speed: 'Speed'
            },
            $moves: ['MovesIds']
        } 
    }
    */
    const pokemonId = req.params.id;
    const updateFields = req.body;

    try {
        const updatePokemon = await PokedexModel.findByIdAndUpdate(
            pokemonId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatePokemon) {
            return res.status(404).send('Type not found');
        }

        res.status(200).send(updatePokemon);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.put('/:id', auth, async (req, res) => {
    /*
      #swagger.tags = ['Pokedex']
      #swagger.description = 'Replace a specific entry in the Pokedex by ID.'
      #swagger.parameters['id'] = { in: 'path', description: 'ID of the Pokedex entry', required: true, type: 'string' }
      #swagger.parameters['body'] = { in: 'body', description: 'Updated information for the Pokedex entry', required: true, 
      schema: {
            $name: {
                english: 'EnglishName',
                japanese: 'JapaneseName',
                chinese: 'ChineseName',
                french: 'FrenchName'
            },
            $type: ['typeid'],
            $base: {
                HP: 'Hit Points',
                Attack: 'Attack',
                Defense: 'Defense',
                'Sp. Attack': 'Special Attack',
                'Sp. Defense': 'Special Defense',
                Speed: 'Speed'
            },
            $moves: ['MovesIds']
        } 
    }
    */
    const { error } = ValidatePokedex(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const pokemonId = req.params.id;
    const updateFields = req.body;

    try {
        const updatePokemon = await PokedexModel.findByIdAndUpdate(
            pokemonId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatePokemon) {
            return res.status(404).send('Type not found');
        }

        res.status(200).send(updatePokemon);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.delete('/:id', auth, async (req, res) => {
    /*
      Delete a specific entry from the Pokedex by ID.
      #swagger.tags = ['Pokedex']
      #swagger.description = 'Delete a specific entry from the Pokedex by ID.'
      #swagger.parameters['id'] = { in: 'path', description: 'ID of the Pokedex entry', required: true, type: 'string' }
    */
    try {
        const pokedex = await PokedexModel.findByIdAndDelete(req.params.id);
        if (!pokedex) return res.status(404).send('Pokedex entry not found.');
        res.status(200).send(pokedex);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

module.exports = router;