const express = require('express');
const { MovesModel, ValidateMoves } = require('../models/moves');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    /* 
    #swagger.tags = ['Moves']
    #swagger.description = 'Create a new move'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Move information',
        required: true,
        schema: {
            $accuracy: 'Accuracy',
            $category: 'Category',
            $ename: 'EnglishName',
            $cname: 'ChineseName',
            $jname: 'JapaneseName',
            $fname: 'FrenchName',
            $power: 'Power',
            $pp: 'Power Points',
            $type: 'typeId'
        }
    }
    */
    const { error } = ValidateMoves(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let move = new MovesModel({
        accuracy: req.body.accuracy,
        category: req.body.category,
        ename: req.body.ename,
        cname: req.body.cname,
        jname: req.body.jname,
        fname: req.body.fname,
        power: req.body.power,
        pp: req.body.pp,
        type: req.body.type
    });

    try {
        move = await move.save();
        res.status(200).send(move);
    } catch (err) {
        res.status(400).send(err.message);
    }  
});

router.get('/', async (req, res) => {
    /*
     #swagger.tags = ['Moves']
     #swagger.description = 'Get all moves'
    */
    try {
        const moves = await MovesModel.find().populate('type');
        res.status(200).send(moves);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get('/:id', async (req, res) => {
    /*
     #swagger.tags = ['Moves']
     #swagger.description = 'Get a move by ID'
     #swagger.parameters['id'] = { description: 'Move ID', required: true }
    */
    try {
        const move = await MovesModel.findById(req.params.id).populate('type');
        if (!move) return res.status(404).send('Move not found.');
        res.status(200).send(move);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

router.patch('/:id', auth, async (req, res) => {
    /*
     #swagger.tags = ['Moves']
     #swagger.description = 'Partially update a move by ID'
     #swagger.parameters['id'] = { description: 'Move ID', required: true }
     #swagger.parameters['body'] = {
         in: 'body',
         description: 'Fields to update',
         required: true,
         schema: {
            $accuracy: 'Accuracy',
            $category: 'Category',
            $ename: 'EnglishName',
            $cname: 'ChineseName',
            $jname: 'JapaneseName',
            $fname: 'FrenchName',
            $power: 'Power',
            $pp: 'Power Points',
            $type: 'typeId'
         }
     }
    */
     const moveId = req.params.id;
     const updateFields = req.body;
 
     try {
         const updateMove = await MovesModel.findByIdAndUpdate(
             moveId,
             { $set: updateFields },
             { new: true, runValidators: true }
         );
 
         if (!updateMove) {
             return res.status(404).send('Type not found');
         }
 
         res.status(200).send(updateMove);
     } catch (err) {
         res.status(400).send(err.message);
     }
});

router.put('/:id', auth, async (req, res) => {
    /*
     #swagger.tags = ['Moves']
     #swagger.description = 'Update a move by ID'
     #swagger.parameters['id'] = { description: 'Move ID', required: true }
     #swagger.parameters['body'] = {
         in: 'body',
         description: 'Updated information for the move',
         required: true,
         schema: {
            $accuracy: 'Accuracy',
            $category: 'Category',
            $ename: 'EnglishName',
            $cname: 'ChineseName',
            $jname: 'JapaneseName',
            $fname: 'FrenchName',
            $power: 'Power',
            $pp: 'Power Points',
            $type: 'moveId'
         }
     }
    */
    const { error } = ValidateMoves(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const moveId = req.params.id;
    const updateFields = req.body;

    try {
        const updateMove = await MovesModel.findByIdAndUpdate(
            moveId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updateMove) {
            return res.status(404).send('Type not found');
        }

        res.status(200).send(updateMove);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.delete('/:id', auth, async (req, res) => {
    /*
     #swagger.tags = ['Moves']
     #swagger.description = 'Delete a move by ID'
     #swagger.parameters['id'] = { description: 'Move ID', required: true }
    */
    try {
        const move = await MovesModel.findByIdAndDelete(req.params.id);
        if (!move) return res.status(404).send('Move not found.');
        res.status(200).send(move);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;