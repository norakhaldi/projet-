import React from 'react';
import Footer from '@/components/Footer';

const FAQ = () => {
  const faqs = [
    {
      question: 'How do I buy a book?',
      answer:
        'Browse our books, add your chosen book to the cart, and place your order. Pay cash when you receive the book or pick it up.',
    },
    {
      question: 'How do I sell a book?',
      answer:
        'Log in to your account, click on sell book or go to your profile, and select "Add a Book." Enter details like title, author, price, and condition.',
    },
    {
      question: 'How do I pay for my order?',
      answer:
        'We only accept cash payments, paid when you receive the book or at pickup.',
    },
  
    {
      question: 'Can I cancel an order?',
      answer:
        'You can cancel an order before it’s shipped  through your profile.',
    },
     
    {
      question: 'What if my book arrives damaged?',
      answer:
        'Contact the seller within 7 days with photos of the damage for a refund or replacement.',
    },
  ];

  return (
    <div className="bg-secondary/10 min-h-screen">
      <section className="py-10 px-4 text-center">
        <h1 className="text-4xl font-bold text-primary">Frequently Asked Questions</h1>
        <p className="mt-4 text-gray-600">Answers to common questions about buying and selling books.</p>
      </section>

      <section className="container mx-auto px-4 pb-8">
        <div className="bg-white p-6 rounded-md border border-gray-300 ">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <h3 className="text-lg font-medium text-primary">{faq.question}</h3>
              <p className="mt-2 text-base text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;