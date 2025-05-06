import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookDetail from '@/components/BookDetail';
import FeaturedBooks from '@/components/FeaturedBooks';
import { getBook } from '@/lib/api';

function BookDetailsPage() {
  const { id } = useParams();
  
  const { data: book, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: () => getBook(id).then(res => res.data),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12">
          {isLoading ? (
            <div className="text-center py-12">Loading book details...</div>
          ) : (
            book && <BookDetail {...book} />
          )}
        </div>
        <div className="mb-12">
          <FeaturedBooks title="You May Also Like" subtitle="Based on your browsing history" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BookDetailsPage;