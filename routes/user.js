const express = require('express');
const mongoose = require('mongoose');
const { UserModel, ValidateUser } = require('../models/user');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = ValidateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = new UserModel({
        admin: req.body.admin,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    user = await user.save();

    res.send(user);
});

module.exports = router;