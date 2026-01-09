
import { Product } from "./types";

export const FEATURED_COLLECTIONS = [
  { title: '二十四史', count: 24 },
  { title: '四庫全書', count: 3500 },
  { title: '古文觀止', count: 222 },
];

/**
 * List of flooring products for the Catalog and Visualizer features.
 */
export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Oak',
    category: 'Wood',
    description: 'Timeless oak planks with a natural finish, perfect for traditional and modern homes alike.',
    thumbnail: 'https://images.unsplash.com/photo-1581850518616-bcb8188c4436?auto=format&fit=crop&q=80&w=200',
    image: 'https://images.unsplash.com/photo-1581850518616-bcb8188c4436?auto=format&fit=crop&q=80&w=800',
    pricePerSqFt: 5.99
  },
  {
    id: '2',
    name: 'Carrara Marble',
    category: 'Marble',
    description: 'Elegant white marble with classic grey veining, offering a luxurious feel to any space.',
    thumbnail: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=200',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800',
    pricePerSqFt: 12.50
  },
  {
    id: '3',
    name: 'Modern Slate',
    category: 'Tile',
    description: 'Durable and chic dark slate tiles, ideal for high-traffic areas and sleek contemporary designs.',
    thumbnail: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=200',
    image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=800',
    pricePerSqFt: 8.75
  },
  {
    id: '4',
    name: 'Smoked Walnut',
    category: 'Wood',
    description: 'Rich, dark walnut wood with deep grains, providing warmth and sophistication.',
    thumbnail: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&q=80&w=200',
    image: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&q=80&w=800',
    pricePerSqFt: 7.49
  },
  {
    id: '5',
    name: 'Urban Concrete',
    category: 'Concrete',
    description: 'Polished concrete finish for an industrial and minimalist aesthetic.',
    thumbnail: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=200',
    image: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=800',
    pricePerSqFt: 6.25
  }
];
