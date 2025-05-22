import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero.jsx';
import Categories from '@/components/Categories';
import FeaturedBooks from '@/components/FeaturedBooks';
import { RecentlyAddedBooks } from '@/components/FeaturedBooks';
import Footer from '@/components/Footer';
import { getBooks } from '@/lib/api';

function Index() {
  const { data: books, isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: () => getBooks().then(res => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes cache (optionnel)
  });

  // Debug: logs
  console.log('Books data:', books);
  if (error) console.error('Failed to load books:', error);

  // Assure-toi que books est un tableau
  const booksArray = Array.isArray(books) ? books : [];

  // Filtrer livres mis en avant
  const featuredBooks = booksArray.filter(book => book.featured);

  // Trier par date création décroissante pour recent
  const recentBooks = booksArray
    .slice() // copie pour ne pas muter l'original
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <div>
      <Navbar />
      <Hero />
      {isLoading ? (
        <div className="text-center py-12">Loading featured books...</div>
      ) : (
        <FeaturedBooks books={featuredBooks} />
      )}
      <Categories />
      {isLoading ? (
        <div className="text-center py-12">Loading recent books...</div>
      ) : (
        <RecentlyAddedBooks books={recentBooks} />
      )}
      <section className="pt-16 pb-0 bg-primary text-white text-center border-b border-gray-300">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold mb-4">Have Books to Sell?</h2>
          <p className="text-xl mb-6 max-w-xl mx-auto">
            List your books on our Book Emporium and connect with readers looking for their next great read.
          </p>
          <a 
            href="/sell" 
            className="inline-block bg-white text-primary font-medium px-6 py-3 rounded-md hover:bg-white/90 transition-colors"
          >
            Start Selling Now
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Index;
