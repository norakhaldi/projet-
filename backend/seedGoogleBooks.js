require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Book = require('./models/Book');

const MONGO_URI = process.env.MONGO_URI;
const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

const categories = [
  'fiction',
  'fantasy',
  'history',
  'romance',
  'science',
  'horror',
  'technology',
  'philosophy'
];

const fetchBooksFromGoogle = async (query) => {
  try {
    const res = await axios.get(`https://www.googleapis.com/books/v1/volumes`, {
      params: {
        q: `subject:${query}`,
        maxResults: 20,
        key: API_KEY,
      },
    });

    const items = res.data.items || [];

    return items.map(item => {
      const info = item.volumeInfo;

      return {
        title: info.title || 'Untitled',
        author: info.authors?.[0] || 'Unknown',
        description: info.description || '',
        price: Math.floor(Math.random() * 40) + 5,
        coverImage: info.imageLinks?.thumbnail || '',
        filePath: '',
        sellerId: new mongoose.Types.ObjectId(),
        featured: false,
        category: info.categories?.[0] || query,
        isbn: (info.industryIdentifiers && info.industryIdentifiers[0]?.identifier) || '',
        publishedYear: info.publishedDate?.slice(0, 4) || '',
        pages: info.pageCount || 200,
        condition: 'like-new',
        createdAt: new Date(),
      };
    });
  } catch (error) {
    console.error(`❌ Error fetching books for "${query}":`, error.message);
    return [];
  }
};

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    await Book.deleteMany();
    console.log('🧹 Cleared old books');

    const allBooks = [];

    for (const category of categories) {
      const books = await fetchBooksFromGoogle(category);
      allBooks.push(...books);
    }

    await Book.insertMany(allBooks);
    console.log(`✅ Inserted ${allBooks.length} books`);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
