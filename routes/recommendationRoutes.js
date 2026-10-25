const express = require('express');
const ReadingHistory = require('../models/ReadingHistory');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

const router = express.Router();

// Recommend blogs based on tags/categories the user has read before
router.get('/', auth, async (req, res) => {
    try {
        const history = await ReadingHistory.find({ user: req.user.id }).populate('blog', 'tags category');
        const readBlogIds = history.map(h => h.blog?._id).filter(Boolean);

        const tagCounts = {};
        const categoryCounts = {};
        for (const h of history) {
            if (!h.blog) continue;
            (h.blog.tags || []).forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1);
            if (h.blog.category) categoryCounts[h.blog.category] = (categoryCounts[h.blog.category] || 0) + 1;
        }

        const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);
        const topCategories = Object.keys(categoryCounts);

        const recommendations = await Blog.find({
            _id: { $nin: readBlogIds },
            status: 'published',
            $or: [
                { tags: { $in: topTags } },
                { category: { $in: topCategories } }
            ]
        }).limit(10).populate('author', 'name').populate('category', 'name');

        res.json(recommendations);
    } catch (err) {
        res.status(500).json({ message: 'Failed to build recommendations', error: err.message });
    }
});

module.exports = router;
