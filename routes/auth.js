const Joi = require('joi');
const bcrypt = require('bcrypt');
const {UserModel} = require('../models/user');
const _ = require('lodash');
const express = require('express');
const router = express.Router();



//login
router.post('/login', async (req, res) => {
    /* 
    #swagger.tags = ['Auth']
    #swagger.description = 'Login'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'User information',
        required: true,
        schema: {
            $email: 'Email',
            $password: 'Password'
        }
    }
    */
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await UserModel.findOne({ email: req.body.email });

    if (!user) res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).status(200).send(_.pick(user, ['_id', 'username', 'email']));
});

function validate(req) {
    const schema = Joi.object({
    email: Joi.string().min(5).max(50).email().required(),
    password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(req);
}

module.exports = router;