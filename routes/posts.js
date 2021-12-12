const express = require('express');
const router = express.Router();

// models
const Post = require('../models/post');

// create
router.post('/:id', async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// update
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
                res.status(200).json(updatedPost);
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(400).json('You can update only your post');
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// delete
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            try {
                await post.delete();
                res.status(200).json('Post has been deleted.');
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(400).json('You can delete only your post');
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// get
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get all posts
router.get('/', async (req, res) => {
    const userName = req.query.user;
    const categoryName = req.query.category;
    try {
        let posts;
        if (userName) {
            posts = await Post.find({userName});
        } else if (categoryName) {
            posts = await Post.find({categories: {$in: [categoryName]}});
        } else {
            posts = await Post.find();
        }
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
