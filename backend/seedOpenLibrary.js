require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Book = require('./models/Book'); // Assure-toi que ce modèle est bien défini

const MONGO_URI = process.env.MONGO_URI;

const categories = [
  'fantasy',
  'science_fiction',
  'romance',
  'history',
  'mystery',
  'horror',
  'poetry',
  'technology'
];

const getCoverUrl = (coverId) => {
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : '';
};

const fetchBooksByCategory = async (category) => {
  try {
    const res = await axios.get(`https://openlibrary.org/subjects/${category}.json?limit=20`);
    const books = res.data.works;

    return books.map(work => ({
      title: work.title,
      author: work.authors?.[0]?.name || 'Unknown',
      description: work.description?.value || work.description || '',
      price: Math.floor(Math.random() * 40) + 5,
      coverImage: getCoverUrl(work.cover_id),
      filePath: '',
      sellerId: new mongoose.Types.ObjectId(),
      featured: false,
      category: category.replace('_', ' '),
      isbn: '', // Open Library ne donne pas directement l'ISBN ici
      publishedYear: '',
      pages: 200,
      condition: 'like-new',
      createdAt: new Date(),
    }));
  } catch (error) {
    console.error(`❌ Failed to fetch books for category: ${category}`, error.message);
    return [];
  }
};

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    await Book.deleteMany();
    console.log('🧹 Cleared old books');

    const allBooks = [];

    for (const category of categories) {
      const books = await fetchBooksByCategory(category);
      allBooks.push(...books);
    }

    await Book.insertMany(allBooks);
    console.log(`✅ Inserted ${allBooks.length} books into the database`);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

seed();
