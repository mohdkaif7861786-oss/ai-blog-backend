const mongoose = require('mongoose');

const readingHistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
    readAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReadingHistory', readingHistorySchema);
