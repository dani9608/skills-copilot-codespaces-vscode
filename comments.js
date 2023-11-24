// Create web server 

// Import modules
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require("express-validator");

// Import models
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const Comment = require('../../models/Comment');

// @route   POST api/comments/:post_id
// @desc    Add comment to post
// @access  Private 
router.post('/:post_id', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    // Check for errors in request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    };
    try {
        // Get user
        const user = await User.findById(req.user.id).select('-password');
        // Get post
        const post = await Post.findById(req.params.post_id);
        // Create new comment
        const newComment = new Comment({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id,
            post: req.params.post_id
        });
        // Save comment
        await newComment.save();
        // Add comment to post
        post.comments.unshift(newComment);
        // Save post
        await post.save();
        // Return post
        res.json(post.comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    };
});

// @route   DELETE api/comments/:comment_id
// @desc    Delete comment
// @access  Private 
router.delete('/:comment_id', auth, async (req, res) => {
    try {
        // Get comment
        const comment = await Comment.findById(req.params.comment_id);
        // Check if comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        };
        // Check if user owns comment
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        };
        // Get post
        const post = await Post.findById(comment.post);
        // Remove comment
        await comment.remove();
        // Remove comment