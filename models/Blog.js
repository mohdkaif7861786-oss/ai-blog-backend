const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },

    // AI-generated metadata
    tags: [{ type: String }],
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative'], default: 'neutral' },
    plagiarismScore: { type: Number, default: 0 }, // 0-100, % similarity to existing content
    aiSummary: { type: String },

    // Engagement metrics
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },

    status: { type: String, enum: ['published', 'draft', 'flagged'], default: 'published' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);
