const express = require('express');
const { UserModel, ValidateUser } = require('../models/user');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
    /* 
    #swagger.tags = ['Users']
    #swagger.description = 'Create a new user'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'User information',
        required: true,
        schema: {
            $username: 'Username',
            $email: 'example@example.com',
            $password: 'examplePassword'
        }
    }
    */
    const { error } = ValidateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt(10);
    const Email = (req.body.email).toLowerCase();
    console.log(Email);
    let user = new UserModel({
        username: req.body.username,
        email: Email,
        password: await bcrypt.hash(req.body.password, salt)
    });

    try {
        user = await user.save();
        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'username', 'email']));
    } catch (err) {
        res.status(400).send(err.message);
    }  
});

router.get('/', auth, async (req, res) => {
    /*
     #swagger.tags = ['Users']
     #swagger.description = 'Get all users'
    */
    try {
        const users = await UserModel.find().select('-password');
        res.status(302).send(users)
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get('/:id', auth, async (req, res) => {
    /*
     #swagger.tags = ['Users']
     #swagger.description = 'Get a user by ID'
     #swagger.parameters['id'] = { description: 'User ID', required: true }
    */
    try {
        const user = await UserModel.findById(req.params.id).select('-password');
        if (!user) return res.status(404).send('User not found.');
        res.status(302).send(user);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

router.patch('/:id', auth, async (req, res) => {
    /*
     #swagger.tags = ['Users']
     #swagger.description = 'Partially update a user by ID'
     #swagger.parameters['id'] = { description: 'User ID', required: true }
     #swagger.parameters['body'] = {
         in: 'body',
         description: 'Fields to update',
         required: true,
         schema: {
             username: 'UpdatedUsername',
             email: 'updated@example.com',
             password: 'updatedPassword'
         }
     }
    */
    const Email = (req.body.email).toLowerCase();
    const userId = req.params.id;
    const updateFields = req.body;
    const salt = await bcrypt.genSalt(10);

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { password: await bcrypt.hash(updateFields.password, salt), email: Email, username: updateFields.username},
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.status(200).send(_.pick(updatedUser, ['_id', 'username', 'email']));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.put('/:id', auth, async (req, res) => {
    /*
     #swagger.tags = ['Users']
     #swagger.description = 'Fully update a user by ID'
     #swagger.parameters['id'] = { description: 'User ID', required: true }
     #swagger.parameters['body'] = {
         in: 'body',
         description: 'User information',
         required: true,
         schema: {
             $username: 'UpdatedUsername',
             $email: 'updated@example.com',
             $password: 'updatedPassword'
         }
     }
    */
    const { error } = ValidateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const Email = (req.body.email).toLowerCase();
    const userId = req.params.id;
    const updateFields = req.body;
    const salt = await bcrypt.genSalt(10);

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { password: await bcrypt.hash(updateFields.password, salt), email: Email, username: updateFields.username},
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.status(200).send(_.pick(updatedUser, ['_id', 'username', 'email']));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.delete('/:id', auth, async (req, res) => {
    /*
     #swagger.tags = ['Users']
     #swagger.description = 'Delete a user by ID'
     #swagger.parameters['id'] = { description: 'User ID', required: true }
    */
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).send('User not found.');
        res.status(200).send(_.pick(user, ['_id', 'username', 'email']));
    } catch (err) {
        res.status(404).send(err.message);
    }
});

module.exports = router;
