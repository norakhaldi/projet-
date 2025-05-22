
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative bg-primary text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-white/10 opacity-30" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '24px 24px'
          }}
        ></div>
      </div>
      <div className="relative container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
          Discover Your Next Literary Adventure
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mb-8">
          Buy and sell new and used books at the Book Emporium, your community marketplace for bibliophiles.
        </p>
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-xl">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-white bg-white/10 backdrop-blur-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-white/70" />
          </div>
          <Button className="bg-white text-primary hover:bg-white/90 px-6">
            Search
          </Button>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button variant="outline" className="border-white text-white hover:bg-white/20">
            Browse Fiction
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/20">
            Non-Fiction
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/20">
            Textbooks
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/20">
            Rare Books
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;