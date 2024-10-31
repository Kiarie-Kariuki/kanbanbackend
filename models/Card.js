const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, default: 'medium' },
  column: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);
