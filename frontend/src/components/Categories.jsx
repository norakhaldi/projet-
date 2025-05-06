import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { id: 1, name: "Fiction", icon: "📚", color: "bg-blue-100" },
  { id: 2, name: "Non-Fiction", icon: "🧠", color: "bg-green-100" },
  { id: 3, name: "Science Fiction", icon: "🚀", color: "bg-purple-100" },
  { id: 4, name: "Romance", icon: "❤️", color: "bg-pink-100" },
  { id: 5, name: "Mystery", icon: "🔍", color: "bg-yellow-100" },
  { id: 6, name: "Biography", icon: "👤", color: "bg-orange-100" },
  { id: 7, name: "History", icon: "🏛️", color: "bg-red-100" },
  { id: 8, name: "Children's", icon: "🧸", color: "bg-teal-100" },
];

function Categories() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold text-center mb-10">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/category/${category.id}`}
              className="flex flex-col items-center p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-secondary/30"
            >
              <span className={`text-4xl ${category.color} h-16 w-16 flex items-center justify-center rounded-full mb-3`}>
                {category.icon}
              </span>
              <h3 className="font-serif text-lg font-medium text-black">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;