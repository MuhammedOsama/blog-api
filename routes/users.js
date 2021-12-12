const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// models
const User = require('../models/user');
const Post = require('../models/post');

// update
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hashSync(req.body.password, salt);
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(401).json('You can update only your account.');
    }
});

// delete
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id) {
        const user = await User.findById(req.params.id);
        if (user) {
            try {
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json('User has been deleted.');
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(400).json('User not found');
        }
    } else {
        res.status(401).json('You can delete only your account.');
    }
});

// get
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password, ...others} = user._doc;

        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
