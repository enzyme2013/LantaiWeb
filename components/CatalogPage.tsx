
import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowRight, ExternalLink } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';

const CatalogPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const categories = ['All', 'Wood', 'Marble', 'Tile', 'Concrete'];

  const filteredProducts = filter === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Our Library</h1>
          <p className="text-neutral-500 text-lg max-w-3xl leading-relaxed">
            A comprehensive collection of world-class architectural surfaces. Each material is vetted for environmental standards and aesthetic longevity.
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  filter === cat 
                    ? 'bg-neutral-900 text-white shadow-lg' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder="Search materials..." 
              className="w-full bg-neutral-100 border-none rounded-full pl-12 pr-6 py-3 text-sm focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group">
              <div className="relative overflow-hidden rounded-[40px] aspect-square bg-neutral-50 mb-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-6 right-6">
                  <div className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-neutral-900 border border-neutral-100 shadow-sm">
                    {product.category}
                  </div>
                </div>
              </div>
              <div className="px-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-serif font-bold text-neutral-900">{product.name}</h3>
                  <span className="text-neutral-900 font-bold">${product.pricePerSqFt.toFixed(2)} <span className="text-neutral-400 text-xs font-normal">/ sqft</span></span>
                </div>
                <p className="text-neutral-500 text-sm leading-relaxed mb-6">{product.description}</p>
                <div className="flex items-center gap-4">
                  <button className="flex-1 bg-neutral-950 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-neutral-800 transition-all">
                    Order Sample
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-neutral-200 hover:border-neutral-900 transition-all">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
