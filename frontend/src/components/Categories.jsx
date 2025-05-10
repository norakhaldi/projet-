import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  StarIcon, 
  GlobeAltIcon, 
  ArchiveBoxIcon, 
  MagnifyingGlassIcon, 
  HeartIcon, 
  RocketLaunchIcon 
} from '@heroicons/react/24/outline';
import { 
  BookOpenIcon as BookOpenIconSolid, 
  AcademicCapIcon as AcademicCapIconSolid, 
  StarIcon as StarIconSolid, 
  GlobeAltIcon as GlobeAltIconSolid, 
  ArchiveBoxIcon as ArchiveBoxIconSolid, 
  MagnifyingGlassIcon as MagnifyingGlassIconSolid, 
  HeartIcon as HeartIconSolid, 
  RocketLaunchIcon as RocketLaunchIconSolid 
} from '@heroicons/react/24/solid';

function Categories() {
  const categories = [
    { name: 'Novels', icon: <BookOpenIcon className="h-6 w-6 text-maroon group-hover:hidden" />, iconHover: <BookOpenIconSolid className="h-6 w-6 text-maroon hidden group-hover:block" />, link: '/books?category=novels' },
    { name: 'Learning', icon: <AcademicCapIcon className="h-6 w-6 text-maroon group-hover:hidden" />, iconHover: <AcademicCapIconSolid className="h-6 w-6 text-maroon hidden group-hover:block" />, link: '/books?category=learning' },
    { name: 'Top Picks', icon: <StarIcon className="h-6 w-6 text-maroon group-hover:hidden" />, iconHover: <StarIconSolid className="h-6 w-6 text-maroon hidden group-hover:block" />, link: '/books?category=top-picks' },
    { name: 'World Reads', icon: <GlobeAltIcon className="h-6 w-6 text-maroon group-hover:hidden" />, iconHover: <GlobeAltIconSolid className="h-6 w-6 text-maroon hidden group-hover:block" />, link: '/books?category=world' },
    { name: 'Classics', icon: <ArchiveBoxIcon className="h-6 w-6 text-maroon group-hover:hidden" />, iconHover: <ArchiveBoxIconSolid className="h-6 w-6 text-maroon hidden group-hover:block" />, link: '/books?category=classics' },
    { name: 'Thrillers', icon: <MagnifyingGlassIcon className="h-6 w-6 text-maroon group-hover:hidden" />, iconHover: <MagnifyingGlassIconSolid className="h-6 w-6 text-maroon hidden group-hover:block" />, link: '/books?category=thrillers' },
    { name: 'Romance', icon: <HeartIcon className="h-6 w-6 text-maroon group-hover:hidden" />, iconHover: <HeartIconSolid className="h-6 w-6 text-maroon hidden group-hover:block" />, link: '/books?category=romance' },
    { name: 'Sci-Fi', icon: <RocketLaunchIcon className="h-6 w-6 text-maroon group-hover:hidden" />, iconHover: <RocketLaunchIconSolid className="h-6 w-6 text-maroon hidden group-hover:block" />, link: '/books?category=sci-fi' },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-serif font-bold text-maroon mb-8 text-center">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.link}
              className="group bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-md border border-secondary/30 p-6 text-center hover:shadow-lg hover:border-maroon transition-all duration-300 w-full min-h-[100px] flex flex-col justify-center"
            >
              <div className="mb-4 flex justify-center transform transition-transform duration-300 hover:scale-110">
                {category.icon}
                {category.iconHover}
              </div>
              <h3 className="text-lg font-medium text-gray-800">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
