require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Book = require('./models/Book');

const getOpenLibraryCover = (isbn) => {
  if (!isbn) return '';
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
};

// Ajouter une fonction pour valider les couvertures
const isValidCover = (url) => {
  if (!url) return false;
  // Exclure les liens sans contenu ou avec codes-barres
  return !url.includes('nophoto') && !url.includes('barcode');
};

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ Connection failed:', err);
});

const categories = ['fiction', 'science', 'fantasy', 'romance', 'history', 'technology', 'mystery'];

const fetchBooksByCategory = async (category) => {
  const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=subject:${category}&maxResults=20`);
  return res.data.items
    .filter(book => book.volumeInfo.title && book.volumeInfo.authors && book.volumeInfo.imageLinks?.thumbnail)
    .map(book => {
      const info = book.volumeInfo;
      const coverUrl = getOpenLibraryCover(info.industryIdentifiers?.[0]?.identifier);
      return {
        title: info.title,
        author: info.authors?.[0],
        description: info.description || '',
        price: Math.floor(Math.random() * 40) + 5,
        coverImage: isValidCover(coverUrl) ? coverUrl : '',
        filePath: '',
        sellerId: new mongoose.Types.ObjectId(),
        featured: false,
        category: category,
        isbn: info.industryIdentifiers?.[0]?.identifier || '',
        publishedYear: info.publishedDate?.split('-')[0] || '',
        pages: info.pageCount || 200,
        condition: 'like-new',
        createdAt: new Date(),
      };
    });
};

const seed = async () => {
  try {
    await Book.deleteMany();
    console.log('🧹 Old books removed.');

    const allBooks = [];
    for (const category of categories) {
      const books = await fetchBooksByCategory(category);
      allBooks.push(...books);
    }

    await Book.insertMany(allBooks);
    console.log(`✅ Inserted ${allBooks.length} real books across ${categories.length} categories.`);
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seeding error:', err);
  }
};

seed();