const express = require('express');
const Blog = require('../models/Blog');
const ReadingHistory = require('../models/ReadingHistory');
const auth = require('../middleware/auth');
const { generateTags, analyzeSentiment, checkPlagiarism, generateSummary } = require('../utils/ai');

const router = express.Router();

// Create a blog — runs it through the AI pipeline first
router.post('/', auth, async (req, res) => {
    try {
        const { title, content, category } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'title and content are required' });
        }

        const existingBlogs = await Blog.find({}, 'content').limit(200);
        const plagiarismScore = checkPlagiarism(content, existingBlogs);

        const blog = await Blog.create({
            title,
            content,
            author: req.user.id,
            category,
            tags: generateTags(content),
            sentiment: analyzeSentiment(content),
            aiSummary: generateSummary(content),
            plagiarismScore,
            status: plagiarismScore > 60 ? 'flagged' : 'published'
        });

        res.status(201).json({ message: 'Blog published', blog });
    } catch (err) {
        res.status(500).json({ message: 'Failed to publish blog', error: err.message });
    }
});

// List blogs (optionally filter by category or tag)
router.get('/', async (req, res) => {
    try {
        const filter = { status: 'published' };
        if (req.query.category) filter.category = req.query.category;
        if (req.query.tag) filter.tags = req.query.tag;

        const blogs = await Blog.find(filter)
            .populate('author', 'name')
            .populate('category', 'name')
            .sort({ date: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load blogs', error: err.message });
    }
});

// Get single blog — increments views and logs reading history
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
            .populate('author', 'name')
            .populate('category', 'name');
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        if (req.query.userId) {
            await ReadingHistory.create({ user: req.query.userId, blog: blog._id });
        }
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load blog', error: err.message });
    }
});

// Like a blog
router.post('/:id/like', auth, async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json({ likes: blog.likes });
    } catch (err) {
        res.status(500).json({ message: 'Failed to like blog', error: err.message });
    }
});

// Delete a blog (author only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this blog' });
        }
        await blog.deleteOne();
        res.json({ message: 'Blog deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete blog', error: err.message });
    }
});

module.exports = router;
