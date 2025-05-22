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
  const { data: books, isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: () => getBooks().then(res => res.data),
  });

  // Debug: Log books to see why featuredBooks is empty
  console.log('Books data:', books);

  const featuredBooks = books?.filter(book => book.featured) || [];
  const recentBooks = books?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8) || [];

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
      <section className="pt-16 pb-0 bg-primary text-white text-center border-b border-gray-300"> {/* Changed to match footer line */}
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