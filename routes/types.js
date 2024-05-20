const express = require('express');
const { TypesModel, ValidateTypes } = require('../models/types');
const router = express.Router();

router.post('/', async (req, res) => {
    /* 
    #swagger.tags = ['Types']
    #swagger.description = 'Create a new type'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Type information',
        required: true,
        schema: {
            $english: 'EnglishName',
            $chinese: 'ChineseName',
            $japanese: 'JapaneseName',
            $french: 'FrenchName'
        }
    }
    */
    const { error } = ValidateTypes(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let type = new TypesModel({
        english: req.body.englishName,
        chinese: req.body.chineseName,
        japanese: req.body.japaneseName,
        french: req.body.frenchName
    });

    try {
        type = await type.save();
        res.status(200).send(type);
    } catch (err) {
        res.status(400).send(err.message);
    }  
});

router.get('/', async (req, res) => {
    /*
     #swagger.tags = ['Types']
     #swagger.description = 'Get all types'
    */
    try {
        const types = await TypesModel.find();
        res.status(302).send(types);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get('/:id', async (req, res) => {
    /*
     #swagger.tags = ['Types']
     #swagger.description = 'Get a type by ID'
     #swagger.parameters['id'] = { description: 'Type ID', required: true }
    */
    try {
        const type = await TypesModel.findById(req.params.id);
        if (!type) return res.status(404).send('Type not found.');
        res.status(302).send(type);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

router.patch('/:id', async (req, res) => {
    /*
     #swagger.tags = ['Types']
     #swagger.description = 'Partially update a type by ID'
     #swagger.parameters['id'] = { description: 'Type ID', required: true }
     #swagger.parameters['body'] = {
         in: 'body',
         description: 'Fields to update',
         required: true,
         schema: {
            $english: 'EnglishName',
            $chinese: 'ChineseName',
            $japanese: 'JapaneseName',
            $french: 'FrenchName'
         }
     }
    */
    const typeId = req.params.id;
    const updateFields = req.body;

    try {
        const updateType = await TypesModel.findByIdAndUpdate(
            typeId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updateType) {
            return res.status(404).send('Type not found');
        }

        res.status(200).send(updateType);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.put('/:id', async (req, res) => {
    /*
     #swagger.tags = ['Types']
     #swagger.description = 'Fully update a type by ID'
     #swagger.parameters['id'] = { description: 'Type ID', required: true }
     #swagger.parameters['body'] = {
         in: 'body',
         description: 'Type information',
         required: true,
         schema: {
            $english: 'EnglishName',
            $chinese: 'ChineseName',
            $japanese: 'JapaneseName',
            $french: 'FrenchName'
         }
     }
    */
    const { error } = ValidateTypes(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const typeId = req.params.id;
    const updateFields = req.body;

    try {
        const updateType = await TypesModel.findByIdAndUpdate(
            typeId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updateType) {
            return res.status(404).send('Type not found');
        }

        res.status(200).send(updateType);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.delete('/:id', async (req, res) => {
    /*
     #swagger.tags = ['Types']
     #swagger.description = 'Delete a type by ID'
     #swagger.parameters['id'] = { description: 'Type ID', required: true }
    */
    try {
        const type = await TypesModel.findByIdAndRemove(req.params.id);
        if (!type) return res.status(404).send('Type not found.');
        res.status(200).send(type);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

module.exports = router;
