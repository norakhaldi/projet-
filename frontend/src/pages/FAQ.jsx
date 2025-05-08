import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FAQ = () => {
  return (
    <div>
      <Navbar />
      <section className="py-12 px-4 text-center">
        <h1 className="text-4xl font-bold">FAQ</h1>
        <p className="mt-4">Frequently Asked Questions page content goes here.</p>
      </section>
      <Footer />
    </div>
  );
};

export default FAQ;