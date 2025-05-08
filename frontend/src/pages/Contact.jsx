import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Contact = () => {
  return (
    <div>
      <Navbar />
      <section className="py-12 px-4 text-center">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="mt-4">Contact Us page content goes here.</p>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;