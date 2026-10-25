const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    role: { type: String, enum: ['reader', 'author', 'admin'], default: 'author' },
    interests: [{ type: String }], // used for personalised recommendations
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
