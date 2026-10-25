const express = require('express');
const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');
const { analyzeSentiment } = require('../utils/ai');

const router = express.Router();

// Add a comment to a blog
router.post('/:blogId', auth, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ message: 'content is required' });

        const comment = await Comment.create({
            blog: req.params.blogId,
            user: req.user.id,
            content,
            sentiment: analyzeSentiment(content)
        });

        await Blog.findByIdAndUpdate(req.params.blogId, { $inc: { commentCount: 1 } });
        res.status(201).json({ message: 'Comment added', comment });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add comment', error: err.message });
    }
});

// Get all comments for a blog
router.get('/:blogId', async (req, res) => {
    try {
        const comments = await Comment.find({ blog: req.params.blogId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load comments', error: err.message });
    }
});

module.exports = router;
