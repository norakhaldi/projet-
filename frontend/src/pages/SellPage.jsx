import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SellForm from '@/components/SellForm';

function SellPage() {
  return (
    <div>
      <Navbar />
      <div className="bg-secondary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-bold mb-4">Sell Your Books</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Turn your used books into cash by listing them on Crimson Book Emporium. 
              It's easy to get started - just fill out the form below with your book's details.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SellForm />
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-secondary/50">
                <h3 className="font-serif text-xl font-bold mb-4 text-primary">Selling Tips</h3>
                <ul className="space-y-3">
                  <li className="flex">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center mr-2">1</span>
                    <span>Take clear photos of your book's cover and condition</span>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center mr-2">2</span>
                    <span>Be honest about the book's condition</span>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center mr-2">3</span>
                    <span>Set a competitive price based on condition and demand</span>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center mr-2">4</span>
                    <span>Include ISBN when possible for easier searching</span>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center mr-2">5</span>
                    <span>Respond promptly to buyer inquiries</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-secondary/50">
                <h3 className="font-serif text-xl font-bold mb-4 text-primary">Book Condition Guide</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">New:</p>
                    <p className="text-gray-600">Just like it sounds. A brand-new book that has never been read or used.</p>
                  </div>
                  <div>
                    <p className="font-semibold">Like New:</p>
                    <p className="text-gray-600">Book appears to be new and unread, with no visible wear.</p>
                  </div>
                  <div>
                    <p className="font-semibold">Very Good:</p>
                    <p className="text-gray-600">Minimal wear, but no tears or markings. Book may have been read but appears almost new.</p>
                  </div>
                  <div>
                    <p className="font-semibold">Good:</p>
                    <p className="text-gray-600">Some wear visible on the binding, cover or pages, but still intact and readable.</p>
                  </div>
                  <div>
                    <p className="font-semibold">Acceptable:</p>
                    <p className="text-gray-600">Shows significant wear but remains intact and readable. May have markings or notes.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary text-white p-6 rounded-lg shadow-md">
                <h3 className="font-serif text-xl font-bold mb-3">Need Help?</h3>
                <p className="mb-4">Have questions about selling your books? Our team is here to assist you!</p>
                <a href="/contact" className="block text-center bg-white text-primary font-medium px-4 py-2 rounded hover:bg-white/90 transition-colors">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SellPage;