// clearBooks.js
require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book');

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  await Book.deleteMany({});
  console.log('✅ All books deleted.');
  mongoose.disconnect();
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
