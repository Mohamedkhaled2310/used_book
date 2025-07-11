const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  author: String,
  price: Number,
  status: String,
  description: String,
  image: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [lng, lat]
  },
  createdAt: { type: Date, default: Date.now }
});

bookSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Book', bookSchema);
